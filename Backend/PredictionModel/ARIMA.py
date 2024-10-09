import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import itertools

# Download stock market data
ticker = 'AAPL'  # Apple Inc.
stock_data = yf.download(ticker, start='2010-01-01', end='2024-08-01')

# Prepare data for ARIMA
close_prices = stock_data['Close']

# Define a grid of possible values for p, d, q
p = range(0, 6)  # Try values from 0 to 5
d = range(0, 3)  # Try values from 0 to 2
q = range(0, 6)  # Try values from 0 to 5

# Generate all combinations of p, d, q values
pdq_combinations = list(itertools.product(p, d, q))

best_aic = float('inf')  # Initialize with a large number
best_pdq = None  # To store the best (p,d,q) combination
best_model = None  # To store the best model

# Loop over all combinations of p, d, q
for pdq in pdq_combinations:
    try:
        # Fit the ARIMA model with the current (p,d,q) combination
        model = ARIMA(close_prices, order=pdq)
        model_fit = model.fit()
        
        # Get the AIC of the model
        aic = model_fit.aic
        
        # Check if this model has a lower AIC than the best model so far
        if aic < best_aic:
            best_aic = aic
            best_pdq = pdq
            best_model = model_fit
            
        print(f'Tested ARIMA{pdq} with AIC: {aic}')  # Print the current model's AIC
    except Exception as e:
        continue

print(f'\nBest ARIMA Parameters: {best_pdq} with AIC: {best_aic}')

# Forecast future prices using the best model
forecast_steps = 10  # Forecast for the next 10 days
forecast = best_model.forecast(steps=forecast_steps)

# Plot the forecasted prices
plt.figure(figsize=(10,6))
plt.plot(close_prices, label='Historical Prices')
plt.plot(pd.date_range(start=close_prices.index[-1], periods=forecast_steps, freq='B'), forecast, label='Forecasted Prices', color='red')
plt.title(f'{ticker} Stock Price Forecast with Best ARIMA Model')
plt.xlabel('Date')
plt.ylabel('Price (USD)')
plt.legend()
plt.show()
