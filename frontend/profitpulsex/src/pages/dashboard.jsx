import React, { useEffect, useState } from "react";
import Card from "../component/card";
import Chart from "../component/Chart";
import HourlyChart from "../component/HourlyChart";

// Function to fetch stock profile data
const fetchStockData = async (symbol) => {
  const apiKey = "crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg";
  const response = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

// Function to fetch current stock price
const fetchCurrentPrice = async (symbol) => {
  const apiKey = "crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg";
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

// Function to fetch predicted price from Python API
const fetchPredictedPrice = async (symbol) => {
  const response = await fetch(
    `http://127.0.0.1:5000/api/predict?symbol=${symbol}`
  ); // Pass symbol to API

  if (!response.ok) {
    throw new Error("Failed to fetch predicted price from API");
  }

  const data = await response.json();
  return data.predicted_price;
};

function Dashboard() {
  const [stockData, setStockData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null); // State for current stock price
  const [priceChange, setPriceChange] = useState(null); // State for price change
  const [percentChange, setPercentChange] = useState(null); // State for percent change
  const [predictedPrice, setPredictedPrice] = useState(null); // State for predicted price
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState("TSLA");

  // New state to track whether the user wants the weekly or hourly chart
  const [isWeekly, setIsWeekly] = useState(true);

  const fetchStocks = async (symbol) => {
    try {
      // Fetch stock profile data
      const data = await fetchStockData(symbol);
      setStockData(data);
      setError(null); // Clear any previous error

      // Fetch current stock price
      const priceData = await fetchCurrentPrice(symbol);
      setCurrentPrice(priceData.c); // Update the current price state (using `c` for current price)
      setPriceChange(priceData.d); // Update the price change state (using `d` for price change)
      setPercentChange(priceData.dp); // Update the percent change state (using `dp` for percentage change)

      // Fetch predicted stock price from the Python backend
      const predictedPrice = await fetchPredictedPrice(symbol); // Pass symbol to fetch predicted price
      setPredictedPrice(predictedPrice); // Set predicted price
    } catch (err) {
      setError("Failed to fetch stock data.");
      setStockData(null); // Clear previous stock data on error
      setCurrentPrice(null); // Clear current price on error
      setPriceChange(null); // Clear price change on error
      setPercentChange(null); // Clear percent change on error
      setPredictedPrice(null); // Clear predicted price on error
    }
  };

  const handleCardClick = (symbol) => {
    setSelectedStock(symbol);
    fetchStocks(symbol);
  };

  // Function to toggle between weekly and hourly chart
  const toggleChart = () => {
    setIsWeekly(!isWeekly);
  };

  return (
    <div className=" grid grid-rows-7 gap-4 p-10 font-quicksand relative bg-bgdark">
      {/* Tesla, GM, Ford buttons */}
      <div className="col-span-4 grid grid-cols-3 gap-4">
        <div
          className="text-2xl text-center cursor-pointer"
          onClick={() => handleCardClick("TSLA")}
        >
          <Card>Tesla</Card>
        </div>
        <div
          className="text-2xl text-center cursor-pointer"
          onClick={() => handleCardClick("GM")}
        >
          <Card>GM</Card>
        </div>
        <div
          className="text-2xl text-center cursor-pointer"
          onClick={() => handleCardClick("F")}
        >
          <Card>Ford</Card>
        </div>
      </div>

      <div className="col-span-4 row-span-4  ">
        <Card>
          {/* Button to toggle between Weekly and Daily (Hourly) Chart */}
          <button
            onClick={toggleChart}
            className="bg-lightgreen font-body text-black text-md px-6 py-2 rounded-lg hover:bg-lightgreen focus:outline-none"
          >
            {isWeekly ? "Hourly Chart" : "Weekly Chart"}
          </button>
          {isWeekly ? (
            <Chart symbol={selectedStock} />
          ) : (
            <HourlyChart symbol={selectedStock} />
          )}
        </Card>
      </div>

      {/* Place the three boxes under the chart */}
      <div className="col-span-4 row-span-2 grid grid-cols-3 gap-4 ">
        <div className="col-span-1">
          <Card>
            Stock Price:{" "}
            {currentPrice !== null
              ? `$${currentPrice} (${priceChange} (${percentChange}%) today)`
              : "Select a stock"}
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            Predicted Price:{" "}
            {predictedPrice !== null ? `$${predictedPrice}` : "N/A"}
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            {error && <div>{error}</div>}
            {stockData ? (
              <div>
                <h2>{stockData.name}</h2>
                <p>Country: {stockData.country}</p>
                <p>Currency: {stockData.currency}</p>
                <p>Exchange: {stockData.exchange}</p>
                <p>IPO Date: {stockData.ipo}</p>
                <p>Market Capitalization: {stockData.marketCapitalization}</p>
                <p>Industry: {stockData.finnhubIndustry}</p>
              </div>
            ) : (
              <p>Select a stock to see details</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
