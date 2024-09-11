import yfinance as yf

# Define the stock ticker (in this case, F for Ford Motor Company)
ticker = 'F'

# Download historical data
stock_data = yf.download(ticker, start='2020-01-01', end='2023-12-31')

# Saves the information into a spreadsheet
stock_data.to_csv('ford_historical_data.csv')
