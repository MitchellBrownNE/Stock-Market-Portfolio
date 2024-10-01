import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import preprocessing
import keras as keras
import numpy as np
from sklearn.model_selection import train_test_split

# LSTM model class that will handle the preparing, building, training, and running the model. 
class LSTMmodel:
    def __init__(self, X_train, X_test, y_train, y_test, backcandles, futurecandles):
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.backcandles = backcandles
        self.futurecandles = futurecandles
        self.model = None

    # Builds the model based off of all the features and predicts 7 hours ahead. 
    def build_model(self):
        features = ['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAL']

        self.model = keras.models.Sequential()

        self.model.add(keras.Input(shape=(self.backcandles, len(features))))
        self.model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=128, return_sequences=True)))
        self.model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=64, return_sequences=False)))
        self. model.add(keras.layers.Dense(units=7))

        self.model.compile(loss='mse', optimizer=keras.optimizers.Adam())

    # Training the model to fit with 20% validation
    def train_model(self):
        self.model.fit(self.X_train, self.y_train, epochs=20, batch_size=30, validation_split=0.2)

    # Determine the loss from the trained model
    def evaluate_model(self):
        loss = self.model.evaluate(self.X_test, self.y_test)
        print(f"Test loss: {loss}")

    # Run all the functions to create the model
    def run_model(self):
        self.build_model()
        self.train_model()
        self.evaluate_model()
#USE KERAS TUNER 