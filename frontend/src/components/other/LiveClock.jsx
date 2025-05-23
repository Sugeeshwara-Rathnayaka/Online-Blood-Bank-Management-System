import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return {
      time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`,
      ampm,
      dateString: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const { time, ampm, dateString } = formatTime(currentTime);

  return (
    <Box textAlign="center" py={4} mb={2}>
      <Text fontSize="2xl" fontWeight="bold" color="gray.600">
        {dateString}
      </Text>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="7xl" fontWeight="bold" color="red.600">
          {time}
        </Text>
        <Box
          ml={2}
          px={2}
          py={1}
          bg="red.100"
          color="red.600"
          borderRadius="md"
          fontWeight="bold"
          fontSize="2xl"
        >
          {ampm}
        </Box>
      </Box>
    </Box>
  );
};

export default LiveClock;
