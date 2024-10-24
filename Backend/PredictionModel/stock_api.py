from datetime import datetime
import yfinance as yf

# Stock class that will modularize downloads and allow objects that are pandas dataframes
class Stock:
    #Object initializer with ticker as identifier
    def __init__(self,ticker):
        self.ticker = ticker
        self.data = None

    # Will download the API data with 1 hour intervals and dropping adjusted close
    def download_data(self, start, end, interval='1h'):
        try:
            self.data = yf.download(self.ticker, start=start, end=end, interval=interval)

        # Will catch exception and print off what exception when downloading
        except Exception as e:
            print(f"Error downloading data for {self.ticker}: {e}")

        return self.data

def DownloadData(ticker):

    # Start and end times for downloading data
    end = datetime.now()
    # Need to make it so it will just be 1yr and 8months previous instead of subtracting to avoid
    # negative numbers.
    start = datetime(end.year - 1, end.month, end.day)

    stock = Stock(ticker)
    stock_data = stock.download_data(start=start, end=end)

    return stock_data