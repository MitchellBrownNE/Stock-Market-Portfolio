import preprocessing
import keras as keras
import numpy as np


class LSTMmodel:
    def __init__(self, split_data, backcandles, futurecandles):
        self.split_data = split_data
        self.backcandles = backcandles
        self.futurecandles = futurecandles

    def split_sets(self):
        for item in self:
            print (len(item))

    def train_model(self):
        features = ['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAL']

        model = keras.models.Sequential()

        model.add(keras.Input(shape=(backcandles, len(features))))
        model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=128, return_sequences=True)))
        model.add(keras.layers.Bidirectional(keras.layers.LSTM(units=64, return_sequences=False)))
        model.add(keras.layers.Dense(units=7))

        model.compile(loss='mse', optimizer=keras.optimizers.Adam())

        return None



if __name__ == '__main__':
    split_data, backcandles, futurecandles = preprocessing.SplitData()
    model = LSTMmodel(split_data, backcandles, futurecandles)

    model.split_sets()

