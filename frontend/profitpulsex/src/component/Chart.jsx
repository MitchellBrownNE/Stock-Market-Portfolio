import React, { useEffect, useState } from "react";
import axios from "axios";

const Chart = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = "Yv28NTcIJ079vty4ZCfwGQEy1ytr1T8_0";
      const symbol = "TSLA";

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
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Last 7 Days Stock Prices</h2>
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stockData.length > 0 && (
        <div>
          {stockData.map((data, index) => (
            <p key={index}>
              {data.date}: ${parseFloat(data.close).toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;
