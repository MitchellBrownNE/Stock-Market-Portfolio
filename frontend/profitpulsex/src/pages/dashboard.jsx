import React, { useEffect, useState } from "react";
import Card from "../component/card";
import Chart from "../component/Chart";
import HourlyChart from "../component/HourlyChart";
import Modal from "../component/modal";

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
  const [currentPrice, setCurrentPrice] = useState(null); 
  const [priceChange, setPriceChange] = useState(null); 
  const [percentChange, setPercentChange] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [teslaPrice, setTeslaPrice] = useState(null);
  const [gmPrice, setGmPrice] = useState(null);
  const [fordPrice, setFordPrice] = useState(null);
  const [error, setError] = useState(null);
  const [ticker, setTicker] = useState('');
  const [sentimentData, setSentimentData] = useState(null);
  const [selectedStock, setSelectedStock] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isWeekly, setIsWeekly] = useState(true);
  const [userShares, setUserShares] = useState(0); 
  const [predictedPriceTomorrow, setPredictedPriceTomorrow] = useState(null);
  const [predictedPriceToday, setPredictedPriceToday] = useState(null);
  const [predictedPriceYesterday, setPredictedPriceYesterday] = useState(null);
  const [sentimentTomorrow, setSentimentTomorrow] = useState(0);
  const [sentimentToday, setSentimentToday] = useState(0);
  const [sentimentYesterday, setSentimentYesterday] = useState(0);


  const fetchSentimentData = async (symbol) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: symbol })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setSentimentData({ error: "Failed to fetch sentiment data" });
    }
  };

  const calculateSentimentDetails = (sentiments) => {
    if (!sentiments || sentiments.length === 0) {
      return { averageScore: 0, predominantSentiment: 'Neutral' };
    }

    let totalScore = 0;
    let sentimentCounts = {};

    sentiments.forEach(sentiment => {
      totalScore += sentiment.score;
      if (sentiment.label) {
        sentimentCounts[sentiment.label] = (sentimentCounts[sentiment.label] || 0) + 1;
      }
    });

    const averageScore = totalScore / sentiments.length;

    let predominantSentiment = 'Neutral';
    let maxCount = 0;
    Object.keys(sentimentCounts).forEach(label => {
      if (sentimentCounts[label] > maxCount) {
        maxCount = sentimentCounts[label];
        predominantSentiment = label;
      }
    });

    return { averageScore, predominantSentiment };
  };

  const handleCardClick = (symbol) => {
    setSelectedStock(symbol);
    fetchStocks(symbol);
    fetchSentimentData(symbol);  
  };

  const fetchStocks = async (symbol) => {
    try {
      const data = await fetchStockData(symbol);
      setStockData(data);
      setError(null);

      const priceData = await fetchCurrentPrice(symbol);
      setCurrentPrice(priceData.c);
      setPriceChange(priceData.d);
      setPercentChange(priceData.dp);

      const predictedPrice = await fetchPredictedPrice(symbol);
      setPredictedPrice(predictedPrice);
    } catch (err) {
      setError("Failed to fetch stock data.");
      setStockData(null);
      setCurrentPrice(null);
      setPriceChange(null);
      setPercentChange(null);
      setPredictedPrice(null);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const teslaData = await fetchCurrentPrice("TSLA");
        const gmData = await fetchCurrentPrice("GM");
        const fordData = await fetchCurrentPrice("F");

        setTeslaPrice(teslaData.c.toFixed(2));
        setGmPrice(gmData.c.toFixed(2));
        setFordPrice(fordData.c.toFixed(2));
      } catch (err) {
        console.error("Failed to fetch stock prices", err);
      }
    };
    fetchPrices();
  }, []);

  const toggleChart = () => {
    setIsWeekly(!isWeekly);
  };

  return (
    <div className="grid grid-rows-7 gap-4 p-10 font-body relative bg-bgdark">
      <div className="col-span-4 grid grid-cols-3 gap-4">
        <div
          className="text-2xl text-center cursor-pointer font-heading"
          onClick={() => handleCardClick("TSLA")}
        >
          <Card selected={selectedStock === "TSLA"}>
            <div>Tesla</div>
            <div className="mt-5">Current Price:</div>
            <div className="text-md">
              {teslaPrice !== null ? `$${teslaPrice}` : "Loading..."}
            </div>
          </Card>
        </div>
        <div
          className="text-2xl text-center cursor-pointer font-heading"
          onClick={() => handleCardClick("GM")}
        >
          <Card selected={selectedStock === "GM"}>
            <div>GM</div>
            <div className="mt-5">Current Price:</div>
            <div className="text-md">
              {gmPrice !== null ? `$${gmPrice}` : "Loading..."}
            </div>
          </Card>
        </div>

        <div
          className="text-2xl text-center cursor-pointer font-heading"
          onClick={() => handleCardClick("F")}
        >
          <Card selected={selectedStock === "F"}>
            <div>Ford</div>
            <div className="mt-5">Current Price:</div>
            <div className="text-md">
              {fordPrice !== null ? `$${fordPrice}` : "Loading..."}
            </div>
          </Card>
        </div>
      </div>
      <div className="col-span-4 row-span-4">
        <Card>
          <button
            onClick={toggleChart}
            className="bg-lightgreen font-body text-black text-md px-6 py-2 rounded-lg hover:bg-lightgreen focus:outline-none mb-5"
          >
            {isWeekly ? "Hourly Chart" : "Weekly Chart"}
          </button>
          {isWeekly ? <Chart symbol={selectedStock} /> : <HourlyChart symbol={selectedStock} />}
        </Card>
      </div>
      <div className="col-span-4 row-span-2 grid grid-cols-3 gap-4">
        <div className="col-span-1 font-body">
          <Card>
            <div className="font-heading text-lg">User Portfolio: {selectedStock}</div>
            <div className="font-body mt-10">
              Shares Owned: {userShares !== null ? userShares : 0} <br />
              Total Value:
            </div>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <p className="font-heading text-lg">Predicted Price:</p>
            <ul className="font-body mt-10">
              <li>Tomorrow: {predictedPriceTomorrow !== null ? `$${predictedPriceTomorrow}` : "$0"}</li>
              <li>Today: {predictedPriceToday !== null ? `$${predictedPriceToday}` : "$0"}</li>
              <li>Yesterday: {predictedPriceYesterday !== null ? `$${predictedPriceYesterday}` : "$0"}</li>
            </ul>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <p className="font-heading text-lg">Sentiment Analysis Score for {selectedStock}:</p>
            <div className="font-body mt-10">
              {sentimentData && sentimentData.sentiments ? (
                <div>
                  <p>Average Score: {calculateSentimentDetails(sentimentData.sentiments).averageScore.toFixed(2)}</p>
                  <p>Predominant Sentiment: {calculateSentimentDetails(sentimentData.sentiments).predominantSentiment}</p>
                  <p className="text-sm mt-2 text-blue-600 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    Click for article details
                  </p>
                </div>
              ) : (
                <p>Loading or no data available...</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for article details */}
{isModalOpen && (
  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Article Headlines for {selectedStock}</h3>
      <button
        onClick={() => setIsModalOpen(false)}
        style={{ fontSize: '1.5rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        X
      </button>
    </div>
    <div style={{ paddingTop: '10px' }}>
      {sentimentData && sentimentData.sentiments ? (
        <ul>
          {sentimentData.sentiments.map((article, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>{article.title}</strong> - Score: {article.score.toFixed(2)}, Sentiment: {article.sentiment}
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available</p>
      )}
    </div>
  </Modal>
)}

{/* Place the three boxes under the chart 
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
      */}
      
    </div>
  );
}

export default Dashboard;
