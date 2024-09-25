import React, { useEffect, useState } from "react";
import Card from "./components/card";

const fetchStockData = async (symbol) => {
  const apiKey = 'crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg'; // Replace with your actual Finnhub API key
  const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  
  const data = await response.json();
  return data;
};

function Dashboard() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStocks = async (symbol) => {
    try {
      const data = await fetchStockData(symbol);
      setStockData(data);
      setError(null); // Clear any previous error
    } catch (err) {
      setError("Failed to fetch stock data.");
      setStockData(null); // Clear previous stock data on error
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

        {/* True Stock and Predicted Stock on the right */}
        <div className="col-span-1 row-span-1">
          <Card>
            True Stock: {stockData ? stockData.ticker : "Select a stock"}
          </Card>
        </div>
        <div className="col-span-1 row-span-1">
          <Card>
            Predicted Stock: {stockData ? stockData.predicted : "N/A"}
          </Card>
        </div>

        {/* Details below True and Predicted Stock */}
        <div className="col-span-1 row-span-5">
          <Card>
            {error && <div>{error}</div>}
            {stockData ? (
              <div>
                <h2>{stockData.name}</h2>
                <p>Country: {stockData.country}</p>
                <p>Currency: {stockData.currency}</p>
                <p>Exchange: {stockData.exchange}</p>
                <p>IPO Date: {stockData.ipoDate}</p>
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
