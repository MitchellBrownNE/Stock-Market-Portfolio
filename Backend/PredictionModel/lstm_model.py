import preprocessing
import keras as keras
import numpy as np
from sklearn.model_selection import train_test_split
import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'


# LSTM model class that will handle the preparing, building, training, and running the model. 
class LSTMmodel:
    def __init__(self, split_data, backcandles, futurecandles):
        self.split_data = split_data
        self.backcandles = backcandles
        self.futurecandles = futurecandles
        self.model = None

    # Preparing that processed data to numpy arrays and split data into test and train sets to run the model
    def prepare_data(self):
        X = []
        y = []

        for ticker in self.split_data:
            X.append(self.split_data[ticker]['X'])
            y.append(self.split_data[ticker]['y'])

        X = np.array(X)
        y = np.array(y)

        X = X.reshape((X.shape[0], self.backcandles, 8))

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        return X_train, X_test, y_train, y_test


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
    def train_model(self, X_train, y_train):
        self.model.fit(X_train, y_train, epochs=20, batch_size=30, validation_split=0.2)

    # Determine the loss from the trained model
    def evaluate_model(self, X_test, y_test):
        loss = self.model.evaluate(X_test, y_test)
        print(f"Test loss: {loss}")

    # Run all the functions to create the model
    def run_model(self):
        X_train, X_test, y_train, y_test = self.prepare_data()
        self.build_model()
        self.train_model(X_train, y_train)
        self.evaluate_model(X_test, y_test)

# Fully run the model from the split data from preprocessing.py
def train():
    split_data, backcandles, futurecandles = preprocessing.SplitData()
    model = LSTMmodel(split_data, backcandles, futurecandles)
    model.run_model()

    print(model.prepare_data())

if __name__ == '__main__':
    train()

#USE KERAS TUNER 