import stock_api
import preprocessing
from keras import layers, models
import keras

tickers = ["TSLA"]

def build_model(hp):
    model = models.Sequential()
    model.add(layers.Input(shape=(7, 8)))

    model.add(layers.Bidirectional(layers.LSTM(units=hp.Int('units_1', min_value=32, max_value=256, step=32), return_sequences=True)))
    model.add(layers.Bidirectional(layers.LSTM(units=hp.Int('units_2', min_value=32, max_value=256, step=32), return_sequences=False)))
    
    # Set the dense units directly to 7
    model.add(layers.Dense(units=7))

    model.compile(
        optimizer=keras.optimizers.Adam(
            hp.Choice('learning_rate', values=[1e-2, 1e-3, 1e-4])),
        loss='mean_squared_error',
        metrics=['mean_squared_error'])

    return model

def runModel():
    for ticker in tickers:
        data = stock_api.DownloadData(ticker)
        X_train, X_test, y_train, y_test, backcandles, futurecandles = preprocessing.ProcessData(data)
        
        tuner = kt.Hyperband(
            build_model,
            objective='val_mean_squared_error',
            max_epochs=20,
            factor=3,
            directory='my_dir',
            project_name='intro_to_kt')

        stop_early = keras.callbacks.EarlyStopping(monitor='val_loss', patience=5)
        
        tuner.search(X_train, y_train, epochs=20, validation_split=0.2, callbacks=[stop_early])

        best_hps = tuner.get_best_hyperparameters(num_trials=1)[0]
        print(f"The hyperparameter search is complete. The optimal number of units in the first LSTM layer is {best_hps.get('units_1')}, the optimal number of units in the second LSTM layer is {best_hps.get('units_2')}, and the optimal learning rate for the optimizer is {best_hps.get('learning_rate')}.")

if __name__ == '__main__':
    runModel()