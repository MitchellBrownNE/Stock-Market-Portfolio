import yfinance as yf
import pandas as pd
import statsmodels.api as sm
from datetime import datetime

# Step 1: Fetch stock price data using yfinance
ticker = 'AAPL'  # Stock ticker symbol
start_date = '2023-01-01'  # Start date for historical data
end_date = datetime.today().strftime('%Y-%m-%d')  # Today's date

# Download stock data and keep only the 'Close' prices
stock_data = yf.download(ticker, start=start_date, end=end_date)[['Close']]

# Ensure the index is in DateTime format and set to business day frequency
stock_data.index = pd.to_datetime(stock_data.index)
stock_data = stock_data.asfreq('B')  # 'B' for business days


sentiment_scores = [0.5, -0.1, 0.3, 0.2, -0.5] 
# Create a DataFrame for sentiment data and set DateTime index
sentiment_data = pd.DataFrame({
    'Sentiment Score': sentiment_scores
}, index=stock_data.index)

# Step 3: Merge stock prices with sentiment data
merged_data = stock_data.join(sentiment_data)

# Step 4: Fit ARIMAX model
# Separate stock prices and sentiment scores
stock_prices = merged_data['Close']
sentiment_scores = merged_data[['Sentiment Score']]  # Use sentiment as an exogenous variable

# Define ARIMA order (p, d, q)
p, d, q = 1, 1, 1  # Adjust as needed

# Fit the ARIMAX model
model = sm.tsa.ARIMA(stock_prices, order=(p, d, q), exog=sentiment_scores)
model_fit = model.fit()

# Step 5: Forecast for the next day
next_day_sentiment = [[0.2]]  # Example sentiment for the next day
forecast = model_fit.forecast(steps=1, exog=next_day_sentiment)

# Output the predicted stock price
print("Predicted stock price for the next day:", forecast[0])
