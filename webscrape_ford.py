import requests
from bs4 import BeautifulSoup

# Step 1: Define the URL of the stock data page
url = 'https://ca.finance.yahoo.com/quote/F/'  # Ford's Yahoo Finance page

# Step 2: Send an HTTP request to the webpage
response = requests.get(url)

# Step 3: Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Step 4: Find the specific HTML element that contains the stock price
# Look for the span with the class that contains the stock price
price = soup.find('span', {'class': 'Fw(b) Fz(36px) Mb(-4px) D(ib)"'})

# Step 5: Print the stock price (if found)
if price:
    print(f"Ford Motor Company Stock Price: {price.get_text()}")
else:
    print("Could not find the stock price.")