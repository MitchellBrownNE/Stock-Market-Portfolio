from datetime import datetime
import yfinance as yf
from flask import jsonify
import io
import json

#StockStats class helps modularize each hour of stocks and allows for easy transfer to the LSTM model.
class StockStats:
    def __init__(self, ticker, datetime, open, high, low, close, adjclose, volume, hourlychange):
        self.ticker = ticker
        self.datetime = datetime
        self.open = open
        self.high = high
        self.low = low
        self.close = close
        self.adjclose = adjclose
        self.volume = volume
        self.hourlychange = hourlychange

    def to_dict(self):
        return {
            'ticker': self.ticker,
            'datetime': self.datetime,
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'close': self.close,
            'adjclose': self.adjclose,
            'volume': self.volume,
            'hourlychange': self.hourlychange
        }

#Data downloader from Yahoo Finance that returns a dictionary to be used.
def DownloadData() -> StockStats:
    #Stocks to use within portfolio.
    stock_ticker = ["TSLA", "GM", "F"]
    stock_stats = []

    #Start and end times for the download parameters for Yahoo Finance API can be adjusted accordingly.
    end = datetime.now()
    start = datetime(datetime.now().year, int(end.month)-6 , datetime.now().day)

    #Download each ticker and add the daily change of each hour and return it to a dictionary
    for ticker in stock_ticker:
        data = yf.download(ticker, start=start, end=end, interval='1h')
        data['Daily Change'] = data['Close'].diff()

        #Removal of datetime index and change it to a column and convert it to string
        data.reset_index(inplace=True)
        data['Datetime'] = data["Datetime"].dt.strftime('%Y-%m-%d %H:%M:%S')

    data.dropna()

    print(data.max())

        
        #Loop to iterate through each row within the pandas data frame to create a list of objects
        #for _, row in data.head(5).iterrows():
            #stock_stats.append(StockStats(ticker=ticker, datetime=data['Datetime'], open=data['Open'], high=data['High'], low=data['Low'], close=data['Close'], adjclose=data['Adj Close'], volume=data['Volume'], hourlychange=data['Daily Change']))

    return stock_stats


if __name__ == '__main__':
    DownloadData()