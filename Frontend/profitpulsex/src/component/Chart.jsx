import React from "react";
import { Line } from "react-chartjs-2";
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
import useStockData from "../hooks/useStockData";

// register  chart.js components
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

  // place holder prediction data
  // const predictionData = stockData.map((data, index) => ({
  //   ...data,
  //   close: (parseFloat(data.close) * 1.01).toFixed(2),
  // }));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${symbol} Stock Prices`,
      },
    },
  };

  const reversedStockData = [...stockData].reverse();
  // const reversedPredictionData = [...predictionData].reverse();

  const data = {
    labels: reversedStockData.map((data) => data.date),
    datasets: [
      {
        label: "Actual Closing Prices",
        data: reversedStockData.map((data) => data.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Predicted Closing Prices",
        //   data: reversedPredictionData.map((data) => data.close),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderDash: [5, 5],
        //   tension: 0.3,
        //   fill: false,
      },
    ],
  };

  return (
    <div className="h-[85%] w-[80%] mx-auto">
      <h2 className="text-2xl font-bold mb-4">{symbol} Stock Prices</h2>
      <p className="text-sm font-semibold ">Last 7 Open Market Days </p>
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stockData.length > 0 && (
        <Line options={options} data={data} />
      )}
    </div>
  );
};

export default Chart;