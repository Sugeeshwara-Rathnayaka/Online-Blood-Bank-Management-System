import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const location = useLocation();
  const isLoginFlow = location.pathname.includes("login");

  const ROLES = [
    {
      name: "Super Admin",
      value: "superadmin",
      description: "System administrator with full access",
      icon: "🔒",
    },
    {
      name: "Blood Bank Admin",
      value: "bloodbankadmin",
      description: "Manage blood bank operations and inventory",
      icon: "🏥",
    },
    {
      name: "Donor",
      value: "donor",
      description: "Register and manage blood donations",
      icon: "🩸",
    },
    {
      name: "Requester",
      value: "requester",
      description: "Request blood for patients in need",
      icon: "🆘",
    },
    {
      name: "Hospital",
      value: "hospital",
      description: "Hospital staff managing blood requests",
      icon: "🏨",
    },
    {
      name: "Organization",
      value: "organization",
      description: "Blood drive organizers and coordinators",
      icon: "👥",
    },
  ];

  // Filter roles for register flow to exclude superadmin and bloodbankadmin
  const visibleRoles = isLoginFlow
    ? ROLES // show all roles on login
    : ROLES.filter(
        (role) => role.value !== "superadmin" && role.value !== "bloodbankadmin"
      );

  const handleRoleSelect = (role) => {
    const path = isLoginFlow ? "/login" : "/register";
    navigate(`${path}?role=${role}`);
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      px={4}
      py={8}
    >
      <Box maxW="6xl" w="100%" px={4}>
        <Heading
          as="h1"
          size="xl"
          textAlign="center"
          mb={2}
          color={useColorModeValue("blue.600", "blue.300")}
        >
          Welcome to BloodLink
        </Heading>
        <Text
          textAlign="center"
          mb={10}
          fontSize="lg"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {isLoginFlow ? "Login As" : "Register As"}
        </Text>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          mb={10}
        >
          {visibleRoles.map((role) => (
            <Box
              key={role.value}
              p={6}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor="transparent"
              _hover={{
                borderColor: "blue.300",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
              textAlign="center"
              cursor="pointer"
              onClick={() => handleRoleSelect(role.value)}
            >
              <Text fontSize="4xl" mb={3}>
                {role.icon}
              </Text>
              <Heading as="h3" size="md" mb={2}>
                {role.name}
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                {role.description}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default RoleSelection;
