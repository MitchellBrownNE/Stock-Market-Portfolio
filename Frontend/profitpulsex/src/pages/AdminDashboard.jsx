import React from "react";
import Card from "../component/card";

// Function to fetch predicted price from Python API
const fetchPredictedPrice = async (symbol) => {
    const response = await fetch(
      `https://stock-market-portfolio-cnjw.onrender.com/api/predict?symbol=${symbol}`
    ); // Pass symbol to API
  
    if (!response.ok) {
      throw new Error("Failed to fetch predicted price from API");
    }
  
    const data = await response.json();
    return data.predicted_price;
  };

function adminDashboard(){
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-bgdark">
      <div className="w-full max-w-md p-8 rounded-sm shadow-lg bg-white">
        <h2 className="text-4xl font-heading text-center mb-8 text-black">About Us</h2>
        <p className="text-black">This is the About Us page content.</p>
      </div>
    </div>
  );

}

export default adminDashboard;