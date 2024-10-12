import React from "react";
import { Line } from "react-chartjs-2";
import useStockData from "../hooks/useStockData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ symbol }) => {
  const { stockData, loading, error } = useStockData(symbol);

  // prepare chart data for last 7 days
  const chartData = {
    labels: stockData.map((data) => data.date),
    datasets: [
      {
        label: `${symbol} Closing Prices`,
        //closing prices
        data: stockData.map((data) => parseFloat(data.close)),
        // line color
        borderColor: "rgba(75, 192, 192, 1)",
        // fill color
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        // line smoothing
        tension: 0.4,
      },
    ],
  };

  // chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Closing Price (USD)",
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{symbol} Stock Prices</h2>
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stockData.length > 0 && (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default Chart;
