import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useStockData = (symbol) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // store data in database for 1 hour
  const cacheDuration = 60 * 60 * 1000;

  const fetchStockData = useCallback(async () => {
    const apiKey = "HgKpkvji3Xc0J6UzHTXKTAafLmvjjpSU";
    const docRef = doc(db, "stockData", symbol);

    try {
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const stockInfo = docSnapshot.data();
        const now = Date.now();

        // If cached data is less than 1 hour old, use it
        if (now - stockInfo.timestamp < cacheDuration) {
          console.log(`Using cached data for ${symbol}`);
          setStockData(stockInfo.data);
          setLoading(false);
          return;
        }
      }

      // If no cached data or data is outdated, fetch new data from the API
      console.log(`Fetching new data for ${symbol} from API`);
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
      );

      // Check if API response contains the necessary data
      if (!response.data["Time Series (Daily)"]) {
        throw new Error(`API response invalid for ${symbol}`);
      }

      // format last 7 days of stock data
      const data = response.data["Time Series (Daily)"];
      const stockDataFormatted = Object.keys(data)
        .slice(0, 7)
        .map((date) => ({
          date,
          close: data[date]["4. close"],
        }));

      // Store the newly fetched data in Firestore
      await setDoc(docRef, {
        data: stockDataFormatted,
        timestamp: Date.now(),
      });

      // Update the local state with new stock data
      setStockData(stockDataFormatted);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      setError(`Failed to fetch stock data for ${symbol}`);
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  return { stockData, loading, error };
};

export default useStockData;
