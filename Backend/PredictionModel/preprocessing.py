from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas_ta as ta
import numpy as np

class ProcessedStock:
    def __init__(self, data):
        self.data = data
        self.feature_scaler = None
        self.target_scaler = None

    def process_stock_data(self, data):
        # Cleaning the data by dropping specific columns and adding in moving averages and dropping
        # null values within dataset
        data['RSI'] = ta.rsi(data['Adj Close'], timeperiod=14)
        data['EMAF'] = ta.ema(data['Adj Close'], timeperiod=20)
        data['EMAM'] = ta.ema(data['Adj Close'], timeperiod=50)
        data['EMAS'] = ta.ema(data['Adj Close'], timeperiod=200)
        data["TargetNextClose"] = data["Adj Close"].shift(-1)
        data.dropna(inplace=True)

        # Separate features and targets for scaling
        features = data[['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAS']]
        target = data[['TargetNextClose']]

        # Initialize the scalers to the object
        self.feature_scaler = StandardScaler()
        self.target_scaler = StandardScaler()

        # Scale both features and targets
        scaled_features = self.feature_scaler.fit_transform(features)
        scaled_target = self.target_scaler.fit_transform(target)

        self.data = np.hstack((scaled_features, scaled_target))

        return self.data

def ProcessData(data):
    scaled_data = ProcessedStock(data)
    processed_stock = scaled_data.process_stock_data(data)

    # days back and days ahead
    backcandles = 48 # Will use 12 days of back candles hourly as there is 7 hrs per day in market
    futurecandles = 7


    X = []
    y = []

    # Appending the 
    for i in range(backcandles, processed_stock.shape[0] - futurecandles):
        X.append(processed_stock[i-backcandles:i, :8])
        y.append(processed_stock[i:i + futurecandles, 3])   

    X = np.array(X)
    y = np.array(y)
    y = np.reshape(y, (y.shape[0], futurecandles))

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size= 0.2, shuffle=False)

    return X_train, X_test, y_train, backcandles, scaled_data.target_scaler