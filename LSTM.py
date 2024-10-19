import sys
import io
import time
import numpy as np
import pandas as pd
import yfinance as yf
import datetime as dt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM
from tensorflow.keras.callbacks import EarlyStopping

# Set encoding to utf-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load Data using yfinance
company = 'META'
start = dt.datetime(2000, 1, 1)  # Start date
end = dt.datetime.now()           # Current date for prediction

# Prepare the model
def prepare_model():
    try:
        data = yf.download(company, start=start, end=end)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

    # Prepare Data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))

    prediction_days = 60
    x_train = []
    y_train = []

    for x in range(prediction_days, len(scaled_data)):
        x_train.append(scaled_data[x-prediction_days:x, 0])
        y_train.append(scaled_data[x, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Build a stronger Model
    model = Sequential()
    model.add(LSTM(units=100, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=100, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=100))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    model.compile(optimizer='adam', loss='mean_squared_error')

    # Early stopping to prevent overfitting
    early_stopping = EarlyStopping(monitor='loss', patience=5)

    # Fit the model
    model.fit(x_train, y_train, epochs=50, batch_size=32, verbose=0, callbacks=[early_stopping])

    return model, scaler, data

def predict_next_price(model, scaler, data):
    # Prepare input for prediction
    total_dataset = data['Close']
    model_inputs = total_dataset[len(total_dataset) - len(data) - 60:].values
    model_inputs = model_inputs.reshape(-1, 1)
    model_inputs = scaler.transform(model_inputs)

    real_data = [model_inputs[len(model_inputs) - 60:len(model_inputs), 0]]
    real_data = np.array(real_data)
    real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))

    prediction = model.predict(real_data)
    prediction = prediction.reshape(-1, 1)  # Reshape for inverse transformation
    prediction = scaler.inverse_transform(prediction)

    return prediction[0][0]

# Main loop to predict every 5 minutes
while True:
    model, scaler, data = prepare_model()
    if model is not None:
        predicted_price = predict_next_price(model, scaler, data)
        print(f"Predicted price for {company} at {dt.datetime.now()} is: {predicted_price}")
    else:
        print("Model preparation failed.")

    time.sleep(300)  # Sleep for 5 minutes
