from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense

class LSTMmodel:
    def __init__(self, X_train, y_train, X_test=None, backcandles=None, units=50, dropout_rate=0.2):
        input_shape = (X_train.shape[1], backcandles)  # Assuming backcandles is a feature dimension
        self.model = self.build_model(input_shape, units, dropout_rate)
        self.train(X_train, y_train)

    def build_model(self, input_shape, units, dropout_rate):
        model = Sequential([
            LSTM(units, input_shape=input_shape, return_sequences=True),
            Dropout(dropout_rate),
            LSTM(units, return_sequences=False),
            Dropout(dropout_rate),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train(self, X_train, y_train, epochs=10, batch_size=32):
        self.model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size)

    def predict(self, X):
        return self.model.predict(X)
