import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SystemHealthChart = () => {
  const chartColor = useColorModeValue("purple.500", "purple.300");
  const gridColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Sample data - replace with real API data
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "System Uptime (%)",
        data: [99.5, 99.8, 99.7, 99.6, 99.9, 99.8, 99.7, 99.9],
        borderColor: chartColor,
        backgroundColor: "rgba(128, 90, 213, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: chartColor,
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColor,
        pointHoverBorderColor: "#fff",
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
          font: {
            weight: "bold",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        min: 95,
        max: 100,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <Box h="300px" position="relative">
      <Text fontSize="sm" mb={2} color={textColor} fontWeight="medium">
        Last 8 Months Performance
      </Text>
      <Line data={data} options={options} />
    </Box>
  );
};

export default SystemHealthChart;
