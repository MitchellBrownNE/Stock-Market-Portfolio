import stock_api
import preprocessing
from lstm_model import LSTMmodel

# Stock tickers
tickers = ["TSLA", "GM"]


def build_train_predict_model():
    # Traverse through each ticker and run the functions
    for ticker in tickers:
        data = stock_api.DownloadData(ticker)

        # Get the scaled data and get the target scaler to un-scale later
        X_train, X_test, y_train, backcandles, target_scaler = preprocessing.ProcessData(data)
        
        # Give the LSTMmodel object the required parameters to train and run model
        model = LSTMmodel(X_train, X_test, y_train, backcandles)
        model.run_model()
        
         # Make predictions on the test data
        predictions = model.model.predict(X_test)
    
        # Extract the next 7 future targets from the predictions
        future_candles_scaled = predictions[-1]
    
        # Un-scale the future target predictions
        future_candles_unscaled = target_scaler.inverse_transform(future_candles_scaled.reshape(-1, 1)).flatten()

        yield ticker, future_candles_unscaled


if __name__ == '__main__':
    for ticker, future_candles in build_train_predict_model():
        print(f"Future candles for {ticker}: {future_candles}")