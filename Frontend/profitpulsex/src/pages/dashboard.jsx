import React, { useState } from "react";

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
  const [predictedPrice, setPredictedPrice] = useState(null); // State for predicted price
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState("TSLA");

  const fetchPredictedPriceForStock = async (symbol) => {
    try {
      // Fetch predicted stock price from the Python backend
      const predictedPrice = await fetchPredictedPrice(symbol); // Pass symbol to fetch predicted price
      setPredictedPrice(predictedPrice); // Set predicted price
      setError(null); // Clear any previous error
    } catch (err) {
      setError("Failed to fetch predicted price.");
      setPredictedPrice(null); // Clear predicted price on error
    }
  };

  const handleCardClick = (symbol) => {
    setSelectedStock(symbol);
    fetchPredictedPriceForStock(symbol);
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <h1 className="text-white text-2xl mb-4">Dashboard</h1>
      <button
        onClick={() => handleCardClick("TSLA")}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Fetch Predicted Price for TSLA
      </button>
      {predictedPrice !== null && (
        <p className="text-white mt-4">Predicted Price: ${predictedPrice}</p>
      )}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
}

export default Dashboard;