from datetime import datetime
import pandas as pd
import yfinance as yf

#Data downloader from Yahoo Finance that returns a dictionary to be used.
def DownloadData():
    stock_ticker = ["TSLA", "GM", "F"]
    stock_data = {}

    #Start and end times for the download parameters for Yahoo Finance API
    end = datetime.now()
    start = datetime(datetime.now().year, int(end.month)-6 , datetime.now().day)

    #Download each ticker and add the daily change of each hour and return it to a dictionary
    for ticker in stock_ticker:
        data = yf.download(ticker, start=start, end=end, interval='1h')
        data['Daily Change'] = data['Close'].diff()
        stock_data[ticker] = data

    return stock_data