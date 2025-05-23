import { Box, Text } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const BarChart = ({ data, labels, color = "#6366f1" }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Donations",
        data,
        backgroundColor: color,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box h="300px">
      <Bar data={chartData} options={options} />
    </Box>
  );
};
