from datetime import datetime
import pandas as pd
import yfinance as yf
import sys

company_list = ["TSLA", "GM", "F"]
end = datetime.now()
start = datetime(datetime.year,(datetime.month - 1), datetime.day)

stock = yf.download("TSLA", start=start, end=end,interval="1h")

df = pd.DataFrame(stock)
print(df.tail(10))

print(sys.getsizeof(stock) / 1024)
print(df.index.size)


