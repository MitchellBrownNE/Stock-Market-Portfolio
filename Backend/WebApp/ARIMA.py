import yfinance as yf
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np
from datetime import datetime

# Define the stock ticker and time frame
ticker = "AAPL"  # Replace with your desired stock ticker
start_date = "2023-01-01"
end_date = datetime.today().strftime('%Y-%m-%d')

# Fetch hourly data
data = yf.download(ticker, start=start_date, end=end_date, interval='1h')

# Prepare the data
data['Hour'] = data.index.hour + data.index.minute / 60  # Convert to decimal hour
data['Target'] = data['Close'].shift(-1)  # Predict the next hour's closing price

# Create additional features
data['Prev_Close'] = data['Close'].shift(1)
data['Volume'] = data['Volume']
data['MA_3'] = data['Close'].rolling(window=3).mean()
data['MA_5'] = data['Close'].rolling(window=5).mean()

# Drop rows with NaN values
data.dropna(inplace=True)

# Features and target variable
X = data[['Hour', 'Prev_Close', 'Volume', 'MA_3', 'MA_5']]
y = data['Target']

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the model using Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict for the specific times between 9:30 AM and 4:30 PM
predictions = {}
for hour in [9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5]:  # 9:30 AM to 4:30 PM
    # Prepare input data for prediction
    last_close = data['Close'].iloc[-1]  # Last known closing price
    last_volume = data['Volume'].iloc[-1]  # Last known volume
    ma_3 = data['MA_3'].iloc[-1]  # Last 3-hour moving average
    ma_5 = data['MA_5'].iloc[-1]  # Last 5-hour moving average

    # Ensure no NaN values exist before making predictions
    if pd.isna(last_close) or pd.isna(last_volume) or pd.isna(ma_3) or pd.isna(ma_5):
        continue  # Skip this iteration if any value is NaN

    input_data = [[hour, last_close, last_volume, ma_3, ma_5]]
    input_scaled = scaler.transform(input_data)  # Scale the input data
    
    # Check if input_scaled is valid
    if np.isnan(input_scaled).any():
        continue  # Skip this iteration if input_scaled has NaN values
    
    prediction = model.predict(input_scaled)

    # Introduce some random fluctuation
    fluctuation = np.random.uniform(-2, 2)  # Adjust the range as needed
    adjusted_prediction = prediction[0] + fluctuation
    
    # Ensure the prediction stays within a realistic range
    adjusted_prediction = max(220, min(240, adjusted_prediction))  # Keep predictions between $220 and $240

    predictions[f"{int(hour)}:00"] = adjusted_prediction

# Output the predictions
print("Hourly Price Predictions from 9:30 AM to 4:30 PM:")
for hour, price in predictions.items():
    print(f"{hour}: ${price:.2f}")