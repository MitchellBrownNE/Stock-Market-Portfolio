from datetime import datetime
import yfinance as yf


##THERE MIGHT BE MORE TO ADD

# Stock class that will modularize downloads and allow objects that are pandas dataframes
class Stock:
    #Object initializer with ticker as identifier
    def __init__(self, ticker):
        self.ticker = ticker
        self.data = None

    #Will download the API data with 1 hour intervals and dropping adjusted close
    def download_data(self, start, end, interval='1h'):
        self.data = yf.download(self.ticker, start=start, end=end, interval=interval)
        self.data.drop(columns=['Adj Close'], inplace=True)
        return self.data

def DownloadData():
    # Define the tickers
    tickers = ["TSLA", "F", "GM"]
    stock_data = {}

    # Start and end times for downloading data
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    # Loop to download the ticker data into each class.
    for ticker in tickers:
        stock = Stock(ticker)
        stock_data[ticker] = stock.download_data(start=start, end=end)

    return stock_data