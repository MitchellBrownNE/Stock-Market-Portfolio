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

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HourlyChart = ({ symbol }) => {
  const { hourlyStockData, loading, error } = useStockData(symbol);

  // Placeholder prediction data
  // const predictionHourlyData = hourlyStockData.map((data) => ({
  //   ...data,
  //   close: (parseFloat(data.close) * 1.01).toFixed(2),
  // }));

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Let it be responsive and take full height/width
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${symbol} Hourly Stock Prices`,
      },
    },
  };

  // Reverse the stock data to ensure it goes from oldest to newest
  const reversedHourlyStockData = [...hourlyStockData].reverse();
  // const reversedPredictionHourlyData = [...predictionHourlyData].reverse();

  // Format time stamps
  const formattedLabels = reversedHourlyStockData.map((data) =>
    new Date(data.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Get the date from the first item in the hourlyStockData array
  const displayDate =
    hourlyStockData.length > 0
      ? new Date(hourlyStockData[0].time).toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Actual Closing Prices (Hourly)",
        data: reversedHourlyStockData.map((data) => data.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Predicted Closing Prices (Hourly)",
        //   data: reversedPredictionHourlyData.map((data) => data.close),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderDash: [5, 5],
        //   tension: 0.3,
        //   fill: false,
      },
    ],
  };

  return (
    <div className="h-[80%] w-[80%] mx-auto">
      <h2 className="text-2xl font-bold mb-4">{symbol} Hourly Stock Prices</h2>
      {/* Display the date for the hourly stock data */}
      {displayDate && (
        <p className="text-sm font-semibold ">Data for: {displayDate}</p>
      )}
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && hourlyStockData.length > 0 && (
        <Line options={options} data={data} />
      )}
    </div>
  );
};

export default HourlyChart;
