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

    backcandles = 24
    futurecandles = 12

    X = []
    y = []

    # This look will fetch each of the tickers within processed_data. The X value will contain a list of lists
    # that will contain 18 previous close prices in each list, the total amount of lists will be the length of
    # the dataset. The y list will contain each of the future prices a day ahead.
    for ticker in processed_data:
        ticker_X = []
        ticker_y = []
        for j in range(backcandles, processed_data[ticker].shape[0] - futurecandles):
            ticker_X.append(processed_data[ticker][j-backcandles:j, :8])
            ticker_y.append(processed_data[ticker][j + futurecandles, 3])
        
        X.append(ticker_X)
        y.append(ticker_y)

        # Add X and y lists to each of the ticker dictionaries
        split_stock[ticker] = {'X': ticker_X, 'y': ticker_y}
    

    return split_stock


    

if __name__ == '__main__':
    
    data = SplitData()

    print(data['F']['y'])