import React, { useState, useEffect } from "react";
import Card from "../component/card";

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

function AdminDashboard(){
    const [predictedPrice, setPredictedPrice] = useState(null); // State for predicted price


    const fetchPredictions = async (symbol) => {
        try {
          // Fetch predicted stock price from the Python backend
          const predictedPrice = await fetchPredictedPrice(symbol); // Pass symbol to fetch predicted price
          setPredictedPrice(predictedPrice); // Set predicted price
        } catch (err) {
          setError("Failed to fetch stock data.");
          setPredictedPrice(null); // Clear predicted price on error
        }
      };

      
  const handleCardClick = (symbol) => {
    setSelectedStock(symbol);
    fetchStocks(symbol);
  };

  
  return (
    <div>
      <button className = "mt-10 bg-lightgreen" onClick={() => fetchPredictions("TSLA")}>Fetch Predictions</button>
      {predictedPrice && <p>Predicted Price: {predictedPrice}</p>}
    </div>
  );

}

export default AdminDashboard;