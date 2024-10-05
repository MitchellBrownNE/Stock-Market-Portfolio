import { useEffect, useState } from "react";
import axios from "axios";

const useStockData = (symbol) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = "HgKpkvji3Xc0J6UzHTXKTAafLmvjjpSU";

      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
        );

        const data = response.data["Time Series (Daily)"];
        const stockDataFormatted = Object.keys(data)
          .slice(0, 7)
          .map((date) => ({
            date,
            close: data[date]["4. close"],
          }));

        setStockData(stockDataFormatted);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch stock data");
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  return { stockData, loading, error };
};

export default useStockData;
