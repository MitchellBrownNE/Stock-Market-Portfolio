import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import matplotlib.pyplot as plt
from transformers import pipeline


# Load historical stock price data
stock_data = pd.read_csv('historical_stock_data.csv')  # Adjust filename if needed
stock_data['Date'] = pd.to_datetime(stock_data['Date'])
stock_data.set_index('Date', inplace=True)

# Load sentiment data
sentiment_data = pd.read_csv('sentiment_data.csv')  # Adjust filename if needed
sentiment_data['Date'] = pd.to_datetime(sentiment_data['Date'])
sentiment_data.set_index('Date', inplace=True)

# Convert both Date columns to naive datetime (remove timezone info)
stock_data.index = stock_data.index.tz_localize(None)
sentiment_data.index = sentiment_data.index.tz_localize(None)

# Print the date ranges for both dataframes
print("Stock Data Date Range:")
print(stock_data.index.min(), "to", stock_data.index.max())

print("\nSentiment Data Date Range:")
print(sentiment_data.index.min(), "to", sentiment_data.index.max())

# Filter sentiment_data to include only dates in the range of stock_data
sentiment_data_filtered = sentiment_data[stock_data.index.min():stock_data.index.max()]

# Print the filtered sentiment data to check dates
print("\nFiltered Sentiment Data:")
print(sentiment_data_filtered.head())

# Merge stock data and filtered sentiment data
merged_data = pd.merge(stock_data, sentiment_data_filtered, on='Date', how='inner')
merged_data.dropna(inplace=True)  # Drop rows with missing values

# Check if merged_data is empty
if merged_data.empty:
    print("Merged data is empty. Check the date ranges and data.")
else:
    print("\nMerged Data:")
    print(merged_data.head())

    # Scale the data only if merged_data is not empty
    scaler = MinMaxScaler(feature_range=(0, 1))
    
    # Extract the relevant features for scaling (adjust as needed)
    features_to_scale = merged_data[['Open', 'High', 'Low', 'Close', 'Volume', 'Score']]
    scaled_data = scaler.fit_transform(features_to_scale)
    
    print("\nScaled Data:")
    print(scaled_data)

    # Define function to create dataset for LSTM
    def create_dataset(data, time_step=1):
        X, y = [], []
        for i in range(len(data) - time_step):
            a = data[i:(i + time_step), :]
            X.append(a)
            y.append(data[i + time_step, 3])  # Assuming 3 is the index of the 'Close' price
        return np.array(X), np.array(y)

    # Set time step
    time_step = 10

    # Check if we have enough samples to create the dataset
    if scaled_data.shape[0] > time_step:
        # Create dataset for LSTM
        X, y = create_dataset(scaled_data, time_step)

        # Reshape input to be [samples, time steps, features]
        X = X.reshape(X.shape[0], X.shape[1], X.shape[2])

        print("\nX shape:", X.shape)
        print("y shape:", y.shape)

        # Now you can proceed with building and training your LSTM model
        # Example of model building code goes here...
    else:
        print("Not enough data to create dataset for LSTM.")
# Build LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
model.add(Dropout(0.2))
model.add(LSTM(50, return_sequences=False))
model.add(Dropout(0.2))
model.add(Dense(25))
model.add(Dense(1))  # Output layer for prediction

model.compile(optimizer='adam', loss='mean_squared_error')

# Split the data into training and testing sets
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Train the model
model.fit(X_train, y_train, batch_size=32, epochs=50)

# Make predictions
train_predict = model.predict(X_train)
test_predict = model.predict(X_test)

# Inverse transform to get actual prices
train_predict = scaler.inverse_transform(np.concatenate((train_predict, np.zeros((train_predict.shape[0], merged_data.shape[1] - 1))), axis=1))[:, 0]
test_predict = scaler.inverse_transform(np.concatenate((test_predict, np.zeros((test_predict.shape[0], merged_data.shape[1] - 1))), axis=1))[:, 0]

# Get actual prices for comparison
actual_prices = scaler.inverse_transform(scaled_data)[:, -1]

# Plotting
plt.figure(figsize=(14,5))
plt.plot(actual_prices, label='Actual Prices', color='blue')
plt.plot(range(time_step, time_step + len(train_predict)), train_predict, label='Train Predictions', color='orange')
plt.plot(range(time_step + len(train_predict), time_step + len(train_predict) + len(test_predict)), test_predict, label='Test Predictions', color='red')
plt.title('Stock Price Prediction')
plt.xlabel('Time')
plt.ylabel('Stock Price')
plt.legend()
plt.show()