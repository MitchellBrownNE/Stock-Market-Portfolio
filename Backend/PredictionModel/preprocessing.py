import stock_api
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas_ta as ta
import numpy as np

class ProcessedStock:
    def __init__(self, data):
        self.data = data

    def process_stock_data(self, data):
        # Cleaning the data by dropping specific columns and adding in moving averages and dropping
        # null values within dataset
        data['RSI'] = ta.rsi(data['Adj Close'], timeperiod=14)
        data['EMAF'] = ta.ema(data['Adj Close'], timeperiod=20)
        data['EMAM'] = ta.ema(data['Adj Close'], timeperiod=50)
        data['EMAS'] = ta.ema(data['Adj Close'], timeperiod=200)
        data["TargetNextClose"] = data["Adj Close"].shift(-1)
        data.dropna(inplace=True)

        scaler = StandardScaler()
        self.data = scaler.fit_transform(data)

        return self.data

def ProcessData(data):
    unscaled_data = ProcessedStock(data)
    processed_stock = unscaled_data.process_stock_data(data)

    # days back and days ahead
    backcandles = 48 # Will use 12 days of back candles hourly as there is 7 hrs per day in market
    futurecandles = 7


    X = []
    y = []

    for i in range(backcandles, processed_stock.shape[0] - futurecandles):
        X.append(processed_stock[i-backcandles:i, :8])
        y.append(processed_stock[i:i + futurecandles, 3])  # Assuming column 3 is the target

    X = np.array(X)
    y = np.array(y)
    y = np.reshape(y, (y.shape[0], futurecandles))

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size= 0.2, shuffle=False)

    return X_train, X_test, y_train, y_test, backcandles, futurecandles