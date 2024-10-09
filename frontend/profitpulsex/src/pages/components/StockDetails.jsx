import React from "react";
import Card from "./Card";

const StockDetails = ({ stockData, error }) => (
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
);

export default StockDetails;
