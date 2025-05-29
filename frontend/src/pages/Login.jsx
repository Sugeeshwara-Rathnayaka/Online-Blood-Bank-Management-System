import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  InputGroup, // Added this import
  InputRightElement, // Added this import
} from "@chakra-ui/react";

// Define role constants for consistency
const ROLES = {
  SUPERADMIN: "superadmin",
  BBADMIN: "bloodbankadmin",
  DONOR: "donor",
  REQUESTER: "requester",
  HOSPITAL: "hospital",
  ORGANIZATION: "organization",
};

const Login = () => {
  const location = useLocation();
  //Get role from URL params if available
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleLocked, setIsRoleLocked] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    role: "",
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const initialRef = useRef();

  useEffect(() => {
    initialRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? value.toLowerCase() : value,
    }));
  };

  // Auto-select the role in dropdown if present
  useEffect(() => {
    if (roleParam && Object.values(ROLES).includes(roleParam.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        role: roleParam.toLowerCase(),
      }));
      setIsRoleLocked(true);
    }
    initialRef.current?.focus();
  }, [roleParam]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate identifier format based on role
      // if (
      //   (formData.role === ROLES.DONOR || formData.role === ROLES.REQUESTER) &&
      //   !/^([0-9]{9}[xXvV]|[0-9]{12})$/.test(formData.identifier)
      // ) {
      //   throw new Error("Please enter a valid NIC number");
      // }

      const { data } = await api.post("/login", {
        role: formData.role,
        identifier: formData.identifier,
        password: formData.password,
      });

      login(data.user, data.token);

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/${formData.role}-dashboard`);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setError(errorMsg);

      toast({
        title: "Login failed",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} px={4}>
      <Box
        w="100%"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={cardBg}
        borderColor={borderColor}
      >
        <Heading as="h1" size="xl" textAlign="center" mb={8}>
          Welcome Back{" "}
          {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </Heading>

        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <FormControl id="role" mb={4} isRequired>
            <Select
              ref={initialRef}
              placeholder="Select your role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              focusBorderColor="blue.500"
              isDisabled={isRoleLocked}
            >
              <option value={ROLES.SUPERADMIN}>Super Admin</option>
              <option value={ROLES.BBADMIN}>Blood Bank Admin</option>
              <option value={ROLES.DONOR}>Donor</option>
              <option value={ROLES.REQUESTER}>Requester</option>
              <option value={ROLES.HOSPITAL}>Hospital</option>
              <option value={ROLES.ORGANIZATION}>Organization</option>
            </Select>
          </FormControl>

          <FormControl id="identifier" mb={4} isRequired>
            <FormLabel>
              {formData.role === ROLES.DONOR ||
              formData.role === ROLES.REQUESTER ||
              formData.role === ROLES.BBADMIN
                ? "NIC Number"
                : "Username"}
            </FormLabel>
            <Input
              type="text"
              name="identifier"
              placeholder={
                formData.role === ROLES.DONOR ||
                formData.role === ROLES.REQUESTER ||
                formData.role === ROLES.BBADMIN
                  ? "Enter your NIC (e.g., 123456789V)"
                  : "Enter your username"
              }
              value={formData.identifier}
              onChange={handleChange}
              focusBorderColor="blue.500"
              autoCapitalize={
                formData.role === ROLES.DONOR ||
                formData.role === ROLES.REQUESTER
                  ? "characters"
                  : "off"
              }
            />
          </FormControl>

          <FormControl id="password" mb={6} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                //type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                focusBorderColor="blue.500"
                autoComplete="current-password"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <Button
              colorScheme="blue"
              size="lg"
              fontSize="md"
              width="95%"
              type="submit"
              isLoading={loading}
              loadingText="Signing in..."
              spinner={<Spinner size="sm" mr={2} />}
              mb={4}
            >
              Sign In
            </Button>
          </FormControl>

          <Text textAlign="center" mt={4}>
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to={`/register${roleParam ? `?role=${roleParam}` : ""}`}
              color="blue.500"
            >
              Register here
            </Link>
          </Text>

          <Text textAlign="center" mt={2}>
            <Link as={RouterLink} to="/forgot-password" color="blue.500">
              Forgot password?
            </Link>
          </Text>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
