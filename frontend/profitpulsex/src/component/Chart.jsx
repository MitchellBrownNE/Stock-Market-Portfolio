import React from "react";
import useStockData from "../hooks/useStockData";

const Chart = ({ symbol }) => {
  const { stockData, loading, error } = useStockData(symbol);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{symbol} Stock Prices</h2>
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stockData.length > 0 && (
        <div>
          {stockData.map((data, index) => (
            <p key={index}>
              {data.date}: ${parseFloat(data.close).toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;
