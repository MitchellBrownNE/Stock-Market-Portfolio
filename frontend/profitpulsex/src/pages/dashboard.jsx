import React, { useState } from "react";
import Card from "./components/Card"; // Import the Card component
import Modal from "./components/Modal"; // Import the Modal component
import ProfileModal from "./components/profile"; // Import the ProfileModal component
import SettingsPage from "./components/settings"; // Import the Settings component
import Navbar from "./components/Navbar"; // Import the Navbar component

const fetchStockData = async (symbol) => {
  const apiKey = 'crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg';
  const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const fetchStockProfile = async (symbol) => {
  const apiKey = 'crnnk0hr01qt44di7ng0crnnk0hr01qt44di7ngg';
  const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

function Dashboard() {
  const [stockData, setStockData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [modalOpen, setModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // State for Profile modal
  const [showSettingsModal, setShowSettingsModal] = useState(false); // State for Settings modal
  const [sentimentData, setSentimentData] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]); // State for selected stocks

  const fetchStocks = async (symbol) => {
    setLoading(true);
    try {
      const priceData = await fetchStockData(symbol);
      const profileData = await fetchStockProfile(symbol);
      setStockData(profileData);
      setCurrentPrice(priceData.c); // Set the current price
      setError(null);
    } catch (err) {
      setError("Failed to fetch stock data.");
      setStockData(null);
      setCurrentPrice(null); // Reset current price on error
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (symbol) => {
    fetchStocks(symbol);
    setSelectedStocks((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol); // Deselect if already selected
      } else {
        return [...prev, symbol]; // Add to selected stocks
      }
    });
  };

  const handlePredictedClick = async () => {
    setModalOpen(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: stockData.ticker }), // Pass the current stock's ticker
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sentiment data.");
      }

      const data = await response.json();
      setSentimentData(data); // Store the fetched sentiment data in state
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      setSentimentData(null); // Clear sentiment data on error
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <Navbar 
        onSettingsClick={() => setShowSettingsModal(true)} 
        onProfileClick={() => setShowProfileModal(true)} // Open Profile modal
      />

      <div className={`h-screen pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-6 gap-4 p-10 font-quicksand relative ${theme === "dark" ? 'bg-bgdark' : 'bg-white'}`}>
        {/* Stock buttons with hover effect */}
        {["TSLA", "GM", "F"].map(symbol => (
          <div
            key={symbol}
            className={`col-span-1 row-span-1 cursor-pointer transform transition-transform duration-300 hover:scale-105 
              ${symbol === 'TSLA' ? 'hover:bg-red-500' : ''} 
              ${symbol === 'GM' ? 'hover:bg-lightblue-500' : ''} 
              ${symbol === 'F' ? 'hover:bg-darkblue-500' : ''}`}
            onClick={() => handleCardClick(symbol)}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              {symbol}
            </Card>
          </div>
        ))}

        {/* Chart on the left side */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-3 row-span-7">
          <Card className="h-full">
            {loading ? <p>Loading chart...</p> : <p>Chart</p>}
          </Card>
        </div>

        {/* Current Price and Predicted Stock */}
        <div className="col-span-1 row-span-1">
          <Card>
            Current Price: {loading ? "Loading..." : (stockData ? `${stockData.ticker}: $${currentPrice ? currentPrice : "N/A"}` : "Select a stock")}
          </Card>
        </div>
        <div className="col-span-1 row-span-1" onClick={handlePredictedClick}>
          <Card>
            Predicted Stock: {loading ? "Loading..." : (stockData ? stockData.predicted : "N/A")}
          </Card>
        </div>

        {/* Details */}
        <div className="col-span-1 row-span-5">
          <Card>
            {error && <div className="text-red-500">{error}</div>}
            {loading ? (
              <p>Loading details...</p>
            ) : (
              stockData ? (
                <div>
                  <h2 className="text-lg font-bold">{stockData.name}</h2>
                  <p>Current Price: {currentPrice ? `$${currentPrice}` : "N/A"}</p>
                  <p>Country: {stockData.country}</p>
                  <p>Currency: {stockData.currency}</p>
                  <p>Exchange: {stockData.exchange}</p>
                  <p>IPO Date: {stockData.ipoDate || "N/A"}</p>
                  <p>Market Capitalization: {stockData.marketCapitalization || "N/A"}</p>
                  <p>Industry: {stockData.finnhubIndustry || "N/A"}</p>
                </div>
              ) : (
                <p>Select a stock to see details</p>
              )
            )}
          </Card>
        </div>

        {/* Theme Toggle Button moved down */}
        <div className="absolute bottom-5 right-5">
          <button onClick={toggleTheme} className="p-2 bg-gray-200 rounded">Toggle Theme</button>
        </div>

        {/* Modal for predicted stock details */}
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <h2 className="text-lg font-bold">Predicted Stock Details</h2>
            {stockData ? (
              <div>
                <p>Name: {stockData.name}</p>
                <p>Predicted: {stockData.predicted}</p>
                {sentimentData ? (
                  <div>
                    <h3 className="text-md font-bold">Sentiment Analysis</h3>
                    <p>Overall Sentiment: {sentimentData.overall_sentiment}</p>
                    <p>Score: {sentimentData.final_score}</p>
                  </div>
                ) : (
                  <p>No sentiment data available.</p>
                )}
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </Modal>
        )}

        {/* Modal for Profile Page */}
        {showProfileModal && (
          <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
        )}

        {/* Modal for Settings Page */}
        {showSettingsModal && (
          <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
            <SettingsPage />
          </Modal>
        )}
      </div>
    </>
  );
}

export default Dashboard;
