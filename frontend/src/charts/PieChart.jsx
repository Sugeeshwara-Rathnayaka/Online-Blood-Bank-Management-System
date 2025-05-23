import { Box } from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const PieChart = ({ data, labels, colors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box h="300px">
      <Pie data={chartData} options={options} />
    </Box>
  );
};
