import preprocessing
from keras.models import Sequential
from keras.layers import Dense, LSTM, Input ,Bidirectional
from keras import optimizers

class LSTMmodel:
    def __init__(self, processed_data):
        self.processed_data = processed_data

    def train_model():
    