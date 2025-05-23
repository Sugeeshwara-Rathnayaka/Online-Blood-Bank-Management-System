import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

const DashboardLayout = () => {
  return (
    <Outlet />
    // <Flex direction="column" minH="100vh" bg="gray.50">
    //   {/* Main content area */}
    //   <Box
    //     flex={1}
    //     p={{ base: 4, md: 6 }}
    //     pt={{ base: "60px", md: 6 }} // If mobile dashboards have fixed headers
    //     overflowX="hidden"
    //   >
    //     <Outlet />
    //   </Box>
    // </Flex>
  );
};

export default DashboardLayout;
