import React, { useEffect, useState } from "react";
import Card from "./components/card";

// Function to fetch stock profile data
const fetchStockData = async (symbol) => {
  const apiKey = 'crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg'; // Replace with your actual Finnhub API key
  const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

// Function to fetch current stock price
const fetchCurrentPrice = async (symbol) => {
  const apiKey = 'crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg'; // Replace with your actual Finnhub API key
  const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

// Function to fetch predicted price from Python API
const fetchPredictedPrice = async (symbol) => {
  const response = await fetch(`https://stock-market-portfolio-cnjw.onrender.com/api/predict?symbol=${symbol}`); // Pass symbol to API

  if (!response.ok) {
    throw new Error("Failed to fetch predicted price from API");
  }

  const data = await response.json();
  return data.predicted_price; // Adjust based on your API response structure
};

function Dashboard() {
  const [stockData, setStockData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null); // State for current stock price
  const [priceChange, setPriceChange] = useState(null); // State for price change
  const [percentChange, setPercentChange] = useState(null); // State for percent change
  const [predictedPrice, setPredictedPrice] = useState(null); // State for predicted price
  const [error, setError] = useState(null);

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
    fetchStocks(symbol);
  };

  return (
    <>
      <div className="h-screen grid grid-cols-4 grid-rows-6 gap-4 p-10 font-quicksand relative bg-bgdark">
        {/* Tesla, GM, Ford buttons */}
        <div className="col-span-1 row-span-1" onClick={() => handleCardClick("TSLA")}>
          <Card>Tesla</Card>
        </div>
        <div className="col-span-1 row-span-1" onClick={() => handleCardClick("GM")}>
          <Card>GM</Card>
        </div>
        <div className="col-span-1 row-span-1" onClick={() => handleCardClick("F")}>
          <Card>Ford</Card>
        </div>
        <div className="col-span-1 row-span-1"></div> {/* Empty space to align */}

        {/* Chart on the left side */}
        <div className="col-span-3 row-span-7">
          <Card>
            {/* Chart Content */}
            Chart
          </Card>
        </div>

        {/* Stock Price and Predicted Price on the right */}
        <div className="col-span-1 row-span-1">
          <Card>
            Stock Price: {currentPrice !== null ? `$${currentPrice} (${priceChange} (${percentChange}%) today)` : "Select a stock"}
          </Card>
        </div>
        <div className="col-span-1 row-span-1">
          <Card>
            Predicted Price: {predictedPrice !== null ? `$${predictedPrice}` : "N/A"} {/* Correctly using predictedPrice */}
          </Card>
        </div>

        {/* Details below Stock Price and Predicted Price */}
        <div className="col-span-1 row-span-5">
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
    </>
  );
}

export default Dashboard;
