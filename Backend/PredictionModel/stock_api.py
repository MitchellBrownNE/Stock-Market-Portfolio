from datetime import datetime
import yfinance as yf


##THERE MIGHT BE MORE TO ADD
tickers = ["TSLA", "F", "GM"]

# Stock class that will modularize downloads and allow objects that are pandas dataframes
class Stock:
    #Object initializer with ticker as identifier
    def __init__(self, ticker):
        self.ticker = ticker
        self.data = None

    #Will download the API data with 1 hour intervals and dropping adjusted close
    def download_data(self, start, end, interval='1h'):
        self.data = yf.download(self.ticker, start=start, end=end, interval=interval)
        self.data.drop(columns=['Close', 'Volume'], inplace=True)
        return self.data

def DownloadData():
    # Define the tickers
    stock_data = {}

    # Start and end times for downloading data
    end = datetime.now()
    # Need to make it so it will just be 1yr and 8months previous instead of subtracting to avoid
    # negative numbers.
    start = datetime(end.year - 1, end.month - 8, end.day)

    # Loop to download the ticker data into each class.
    for ticker in tickers:
        stock = Stock(ticker)
        stock_data[ticker] = stock.download_data(start=start, end=end)

    return stock_data