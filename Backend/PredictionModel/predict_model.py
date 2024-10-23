import stock_api
import preprocessing
from lstm_model import LSTMmodel
from transformer_model import TransformerModel
import json

# Stock tickers

class PredictionModel:
    def __init__(self, ticker):
        self.ticker = ticker
        self.stock_predictions = {}

    def build_train_predict_model(self):
        # Traverse through each ticker and run the functions
        data = stock_api.DownloadData(self.ticker)

        # Get the scaled data and get the target scaler to un-scale later
        X_train, X_test, y_train, backcandles, target_scaler = preprocessing.ProcessData(data)
            
        # Give the LSTMmodel object the required parameters to train and run model
        lstm_model = LSTMmodel(X_train, X_test, y_train, backcandles)
        lstm_model.run_model()

        transformer_model = TransformerModel(X_train, X_test, y_train, backcandles)
        transformer_model.run_model()
        
        # Make predictions on the test data
        lstm_predictions = lstm_model.model.predict(X_test)
        transformer_predictions = transformer_model.model.predict(X_test)
    
        # Extract the next 7 future targets from the predictions
        lstm_future_candles_scaled = lstm_predictions[-1]
        transformer_future_candles_scaled = transformer_predictions[-1]
    
        # Un-scale the future target predictions
        lstm_future_candles_unscaled = target_scaler.inverse_transform(lstm_future_candles_scaled.reshape(-1, 1)).flatten()
        transformer_future_candles_unscaled = target_scaler.inverse_transform(transformer_future_candles_scaled.reshape(-1, 1)).flatten()

        self.stock_predictions[self.ticker] = {
            "lstm_predictions" : lstm_future_candles_unscaled.tolist(),
            "transformer_predictions" : transformer_future_candles_unscaled.tolist()
        }

    def prediction_to_json(self):
        stock_predictions_json = json.dumps(self.stock_predictions)

        return stock_predictions_json
    

if __name__ == "__main__":
    prediction_model = PredictionModel("TSLA")
    prediction_model.build_train_predict_model()
    predicts = prediction_model.prediction_to_json()

    print(predicts)