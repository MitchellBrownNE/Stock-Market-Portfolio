import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useStockData = (symbol) => {
  const [stockData, setStockData] = useState([]);
  const [hourlyStockData, setHourlyStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "GDHSA4XERHME27FZ";
  const cacheDuration = 60 * 60 * 1000;

  const getLastMarketDay = () => {
    const today = new Date();

    // Convert to eastern time zone
    const localDate = new Date(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(today)
    );

    // 0 = Sunday, 6 = Saturday
    const localHour = localDate.getHours();
    const localMinutes = localDate.getMinutes();
    const localDay = localDate.getDay();

    console.log(
      "Today (local time):",
      localDate.toLocaleString(),
      "Local day:",
      localDay,
      "Local hour:",
      localHour
    );

    // If it's Monday, go back to Friday
    if (localDay === 1) {
      localDate.setDate(localDate.getDate() - 3);
    }
    // If it's Sunday, go back to Friday
    else if (localDay === 0) {
      localDate.setDate(localDate.getDate() - 2);
    }
    // If it's Saturday, go back to Friday
    else if (localDay === 6) {
      localDate.setDate(localDate.getDate() - 1);
    }
    // For Tuesday to Friday, go back to the previous day
    else {
      localDate.setDate(localDate.getDate() - 1);
    }

    // Return the previous market day
    return localDate.toLocaleDateString("en-CA");
  };
  // Filter only the data between 9:30 AM and 4:00 PM -- market hours
  const filterMarketHours = (data) => {
    return Object.keys(data)
      .filter((timestamp) => {
        const date = timestamp.split(" ")[0];
        const time = new Date(timestamp).getHours();
        const minutes = new Date(timestamp).getMinutes();

        // Check if it falls within market hours (9:30 AM to 4:00 PM)
        return (
          date === getLastMarketDay() &&
          ((time === 9 && minutes >= 30) || (time >= 10 && time < 16))
        );
      })
      .map((timestamp) => ({
        time: timestamp,
        close: data[timestamp]["4. close"],
      }));
  };

  // Fetch stock data (weekly and hourly)
  const fetchStockData = useCallback(async () => {
    const docRef = doc(db, "stockData", `${symbol}-combined`);

    try {
      const docSnapshot = await getDoc(docRef);
      const now = Date.now();

      // Check if the cache is still valid or the date has changed
      const lastMarketDay = getLastMarketDay();
      if (docSnapshot.exists()) {
        const stockInfo = docSnapshot.data();

        // If cached data is for the current day and still valid, use it
        if (
          now - stockInfo.timestamp < cacheDuration &&
          stockInfo.lastMarketDay === lastMarketDay
        ) {
          console.log(`Using cached data for ${symbol}`);
          setStockData(stockInfo.weeklyData);
          setHourlyStockData(stockInfo.hourlyData);
          setLoading(false);
          return;
        }
      }

      // Fetch new hourly and weekly data if the cache is invalid or outdated
      console.log(`Fetching new combined data for ${symbol} from API`);
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${apiKey}`
      );
      console.log("here is the", response.data);
      if (!response.data["Time Series (60min)"]) {
        throw new Error(`API response invalid for ${symbol}`);
      }

      const data = response.data["Time Series (60min)"];

      // Filter the hourly data for only today's market hours
      const hourlyStockDataFormatted = filterMarketHours(data);

      // Format last 7 days of data for weekly chart
      const lastSevenDays = Object.keys(data).reduce((acc, timestamp) => {
        const date = timestamp.split(" ")[0];
        if (!acc[date]) {
          acc[date] = { date, close: data[timestamp]["4. close"] };
        }
        return acc;
      }, {});
      const weeklyStockDataFormatted = Object.values(lastSevenDays).slice(0, 7);

      // Store the newly fetched data in Firestore, along with the current date (last market day)
      await setDoc(docRef, {
        weeklyData: weeklyStockDataFormatted,
        hourlyData: hourlyStockDataFormatted,
        lastMarketDay,
        timestamp: Date.now(),
      });

      // Update local state
      setStockData(weeklyStockDataFormatted);
      setHourlyStockData(hourlyStockDataFormatted);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      setError(`Failed to fetch stock data for ${symbol}`);
      setLoading(false);
    }
  }, [symbol, apiKey]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  return { stockData, hourlyStockData, loading, error };
};

export default useStockData;
