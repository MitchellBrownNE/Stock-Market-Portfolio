from datetime import datetime
import yfinance as yf

#Data downloader from Yahoo Finance that returns a dictionary to be used.
def DownloadData():

    # Define the ticker symbol
    ticker = ["TSLA", "F", "GM"]
    stockData = {}

    # Start and end times for downloading data
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    for stock in ticker:
        data = yf.download(stock, start=start,end=end, interval='1h')
        stockData[stock] = data

    for stock in stockData:
        stockData[stock].drop(columns=['Adj Close'], inplace=True)
    
    return stockData