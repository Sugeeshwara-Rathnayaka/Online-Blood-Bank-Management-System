import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserActivityChart = () => {
  const primaryColor = useColorModeValue("purple.500", "purple.300");
  const secondaryColor = useColorModeValue("blue.500", "blue.300");
  const gridColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Sample data - replace with real API data
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "New Users",
        data: [45, 32, 56, 28, 41, 23, 15],
        backgroundColor: primaryColor,
        borderRadius: 4,
      },
      {
        label: "Active Users",
        data: [120, 145, 132, 156, 148, 110, 85],
        backgroundColor: secondaryColor,
        borderRadius: 4,
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
        stacked: false,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        stacked: false,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          precision: 0,
        },
      },
    },
  };

  return (
    <Box h="300px" position="relative">
      <Text fontSize="sm" mb={2} color={textColor} fontWeight="medium">
        Weekly User Activity
      </Text>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default UserActivityChart;
