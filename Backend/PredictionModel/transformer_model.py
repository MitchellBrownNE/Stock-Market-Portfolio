from keras import layers, models

# Transformer model class that will handle the preparing, building, training, and running the model. 
class TransformerModel:
    def __init__(self, X_train, X_test, y_train, backcandles):
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.backcandles = backcandles
        self.model = None

    # This function will build the model with creating the attention and feed forward layers
    # it then creates a global pooling average in a singular array then it will
    # have a final dense layer with 7 outputs that predicts 7 hours in advance.
    def build_model(self):
        features = ['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAL']
        input_shape = (self.backcandles, len(features))

        inputs = layers.Input(shape = input_shape)

        attention_output = layers.MultiHeadAttention(num_heads = 2, key_dim= 2)(inputs, inputs)
        attention_output = layers.LayerNormalization(epsilon=1e-6)(attention_output)
        attention_output = layers.Dropout(0.1)(attention_output)

        feedforward_output = layers.Dense(units = 64, activation= 'relu')(attention_output)
        feedforward_output = layers.Dense(units = 64)(feedforward_output)
        feedforward_output = layers.LayerNormalization(epsilon = 1e-6)(feedforward_output)
        feedforward_output = layers.Dropout(0.1)(feedforward_output)

        global_avg_output = layers.GlobalAveragePooling1D()(feedforward_output)

        outputs = layers.Dense(7)(global_avg_output)

        self.model = models.Model(inputs = inputs, outputs = outputs)
        self.model.compile(optimizer = "adam", loss = 'mse')

    # Train model allows the model to begin working with 20% validation.
    def train_model(self):
        self.model.fit(self.X_train, self.y_train, batch_size = 30, epochs = 20, validation_split = 0.2)

    def run_model(self):
        self.build_model()
        self.train_model()