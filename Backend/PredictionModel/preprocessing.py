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

if __name__ == '__main__':
    processed = ProcessData()

    print(processed['F'].shape)
    print(processed['GM'].shape)
    print(processed['TSLA'].shape)
