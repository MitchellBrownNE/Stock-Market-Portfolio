from flask import Flask, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
import datetime as dt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM

app = Flask(__name__)

# Define constants for the company and date range
company = 'META'
start = dt.datetime(2000, 1, 1)
end = dt.datetime.now()

# Load the LSTM model
def prepare_model():
    data = yf.download(company, start=start, end=end)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))

    # Prepare data for training
    prediction_days = 60
    x_train = []
    y_train = []

    for x in range(prediction_days, len(scaled_data)):
        x_train.append(scaled_data[x - prediction_days:x, 0])
        y_train.append(scaled_data[x, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Build the model
    model = Sequential()
    model.add(LSTM(units=100, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=100, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=100))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    model.compile(optimizer='adam', loss='mean_squared_error')

    model.fit(x_train, y_train, epochs=50, batch_size=32, verbose=0)

    return model, scaler, data

def predict_next_price(model, scaler, data):
    total_dataset = data['Close']
    model_inputs = total_dataset[len(total_dataset) - 60:].values.reshape(-1, 1)
    model_inputs = scaler.transform(model_inputs)

    real_data = np.array([model_inputs])
    real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))

    prediction = model.predict(real_data)
    prediction = scaler.inverse_transform(prediction)

    return prediction[0][0]

@app.route('/predict', methods=['GET'])
def predict():
    model, scaler, data = prepare_model()
    predicted_price = predict_next_price(model, scaler, data)
    return jsonify({'predicted_price': predicted_price})

if __name__ == '__main__':
    app.run(debug=True)
