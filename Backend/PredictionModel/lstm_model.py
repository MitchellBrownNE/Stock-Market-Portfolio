import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import keras as keras
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LSTM model class that will handle the preparing, building, training, and running the model. 
class LSTMmodel:
    def __init__(self, X_train, X_test, y_train, backcandles):
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.backcandles = backcandles
        self.model = None

    # Builds the model based off of all the features and predicts 7 hours ahead. 
    def build_model(self):
        features = ['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAL']

        self.model = keras.models.Sequential()

        # Add layers that have 160 and 128 neutrons respectively, and have a dropout rate of 10%, and
        # batch normalize after the relu activation. 
        self.model.add(keras.Input(shape=(self.backcandles, len(features))))
        self.model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=160, return_sequences=True)))
        self.model.add(keras.layers.Dropout(rate=0.1))
        self.model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=128, return_sequences=False)))

        # Using a 64 layer that uses relu for activation, then normalizes the data to allow the model to create a
        # dense layer that outputs 7 values which are the predictions
        self.model.add(keras.layers.Dense(units=64, activation='relu'))
        self.model.add(keras.layers.BatchNormalization())
        self.model.add(keras.layers.Dense(units=7))

        # After training, the model compiles using mean squared error as the loss value and uses Adam optimizer 
        self.model.compile(loss='mse', optimizer=keras.optimizers.Adam())

    # Training the model to fit with 20% validation
    def train_model(self):
        logger.info("Started")
        self.model.fit(self.X_train, self.y_train, epochs=20, batch_size=30, validation_split=0.2)
        logger.info("Ended")

    # Run all the functions to create the model
    def run_model(self):
        self.build_model()
        self.train_model()


    def get_logging_callback(self):
        class LoggingCallback(keras.callbacks.Callback):
            def on_epoch_end(self, epoch, logs=None):
                logger.info(f"Epoch {epoch + 1}: {logs}")
        return LoggingCallback()