import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
import { toast } from "react-toastify";
import api from "../../api/api";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  //Select,
  Button,
  Heading,
  Text,
  //useToast,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  InputGroup, // Added this import
  //InputRightElement, // Added this import
} from "@chakra-ui/react";

const DonorLogin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/donor/login",
        { nic, password, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

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
          Welcome Back
        </Heading>

        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <FormControl id="nic" mb={4} isRequired>
            <FormLabel>NIC Number</FormLabel>
            <Input
              type="text"
              name="nic"
              placeholder="Enter your NIC (e.g., 123456789V)"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              focusBorderColor="blue.500"
            />
          </FormControl>

          <FormControl id="password" mb={6} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="blue.500"
                autoComplete="current-password"
              />
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            fontSize="md"
            width="full"
            type="submit"
            isLoading={loading}
            loadingText="Signing in..."
            spinner={<Spinner size="sm" mr={2} />}
            mb={4}
          >
            Sign In
          </Button>

          <Text textAlign="center" mt={4}>
            Don't have an account?{" "}
            <Link as={RouterLink} to={"/donor/register"} color="blue.500">
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

  // return (
  //   <div className="container form-component login-form">
  //     <h2>Donor Login</h2>
  //     <p>Please Login To Continue</p>
  //     <p>
  //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quasi
  //       similique explicabo illo aliquid tenetur!
  //     </p>
  //     <form onSubmit={handleLogin}>
  //       <input
  //         type="text"
  //         value={nic}
  //         onChange={(e) => setNic(e.target.value)}
  //         placeholder="NIC"
  //       />
  //       <input
  //         type="password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         placeholder="Password"
  //       />
  //       <div
  //         style={{
  //           gap: "10px",
  //           justifyContent: "flex-end",
  //           flexDirection: "row",
  //         }}
  //       >
  //         <p style={{ marginBottom: 0 }}>Not Registered?</p>
  //         <Link
  //           to={"/donor/register"}
  //           style={{ textDecoration: "none", alignItems: "center" }}
  //         >
  //           Register Now
  //         </Link>
  //       </div>
  //       <div style={{ justifyContent: "center", alignItems: "center" }}>
  //         <button type="submit">Login</button>
  //       </div>
  //     </form>
  //   </div>
  // );
};

export default DonorLogin;
