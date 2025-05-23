import { Button, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const ROLES = [
  { value: "donor", label: "Blood Donor" },
  { value: "requester", label: "Blood Requester" },
  { value: "hospital", label: "Hospital" },
  { value: "organization", label: "Organization" },
  { value: "bbadmin", label: "Blood Bank Admin" },
];

const RoleSelection3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginFlow = location.pathname.includes("login");

  const handleRoleSelect = (role) => {
    const path = isLoginFlow ? "/login" : "/register";
    navigate(`${path}?role=${role}`);
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <VStack spacing={6} p={8} maxW="md" w="full">
        <Heading as="h1" size="xl" mb={2}>
          {isLoginFlow ? "Login As" : "Register As"}
        </Heading>
        <Text color="gray.500" mb={6}>
          Select your account type
        </Text>

        {ROLES.map((role) => (
          <Button
            key={role.value}
            colorScheme="blue"
            size="lg"
            w="full"
            onClick={() => handleRoleSelect(role.value)}
          >
            {role.label}
          </Button>
        ))}

        <Button
          variant="link"
          mt={4}
          onClick={() => navigate(isLoginFlow ? "/login" : "/")}
        >
          {isLoginFlow ? "Back to Login" : "Back to Home"}
        </Button>
      </VStack>
    </Flex>
  );
};

export default RoleSelection3;
