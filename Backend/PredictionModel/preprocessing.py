import stock_api
from sklearn.preprocessing import MinMaxScaler
import numpy as np

class ProcessedStock:
    def __init__(self, data):
        self.data = data

    def process_data(self, features):
        scaler = MinMaxScaler(feature_range=(0, 1))
        self.data = scaler.fit_transform(data[features])

        return self.data
    
    
def ProcessData():
    processed_stock = {}
    features = ['Open', 'High', 'Low', 'Close', 'Volume']
    data = stock_api.DownloadData()
    
    for ticker in stock_api.tickers:
        processed_stock[ticker] = ProcessedStock(data[ticker])

    return processed_stock

if __name__ == '__main__':
    processed = ProcessData()
    print(processed['F'])

