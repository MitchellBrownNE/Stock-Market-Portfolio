import stock_api
from sklearn.preprocessing import StandardScaler
import pandas_ta as ta
import numpy as np

class ProcessedStock:
    def __init__(self, data):
        self.data = data

    def process_stock_data(self, data):
        features = ['Open', 'High', 'Low', 'Adj Close', 'RSI', 'EMAF', 'EMAM', 'EMAL']

        data['RSI'] = ta.rsi(data['Adj Close'], timeperiod=14)
        data['EMAF'] = ta.ema(data['Adj Close'], timeperiod=20)
        data['EMAM'] = ta.ema(data['Adj Close'], timeperiod=50)
        data['EMAS'] = ta.ema(data['Adj Close'], timeperiod=200)
        data["TargetNextClose"] = data["Adj Close"].shift(-1)

        data.dropna(inplace=True)

        scaler = StandardScaler()
        self.data = scaler.fit_transform(data)

        return self.data
    
    # Getter for object data
    def get_data(self):
        return self.data
    
def ProcessData():
    processed_stock = {}
    data = stock_api.DownloadData()

    for ticker in data:
        unscaled_data = ProcessedStock(data)
        processed_stock[ticker] = unscaled_data.process_stock_data(data[ticker])

    return processed_stock

def SplitData():
    split_stock = {}
    processed_data = ProcessData()

    backcandles = 18
    futurecandles = 1

    X = []
    y = []

    for ticker in processed_data:
        ticker_X = []
        ticker_y = []
        print(processed_data[ticker].shape)
        for j in range(backcandles, processed_data[ticker].shape[0] - futurecandles):
            features = processed_data[ticker][j-backcandles:j, :8]
            label = processed_data[ticker][j + futurecandles, 3]
            ticker_X.append(features)
            ticker_y.append(label)
        
        X.append(ticker_X)
        y.append(ticker_y)

    # Flatten the lists if you want a single list of samples
    X = [item for sublist in X for item in sublist]
    y = [item for sublist in y for item in sublist]
    

if __name__ == '__main__':
    SplitData()