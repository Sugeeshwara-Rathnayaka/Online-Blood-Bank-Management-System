import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  VStack,
  Heading,
  Box,
  useToast,
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import api from "../../api/api";
import BloodBankSelect from "../select/BloodBankSelect";

const AddBBAdminForm = ({ onSuccess, bloodBanks }) => {
  // Color variables with dark mode support
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("red.600", "red.500");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bloodBankName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nic: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/superadmin/add-bbadmin", formData);

      toast({
        title: "Admin Added",
        description: `${formData.firstName} ${formData.lastName} has been successfully registered.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      if (onSuccess) onSuccess();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        bloodBankName: "",
        email: "",
        password: "",
        confirmPassword: "",
        nic: "",
        phone: "",
      });
    } catch (err) {
      console.error("Error adding admin:", err);
      setError(err.response?.data?.message || "Failed to add admin");

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add admin",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="md"
      bg={bg}
    >
      <Heading as="h2" size="lg" mb={6} color={brandColor}>
        Register New Blood Bank Admin
      </Heading>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">Blood Bank</FormLabel>
            <BloodBankSelect
              value={formData.bloodBankName}
              onChange={handleChange}
              bloodBanks={bloodBanks}
              brandColor="red.500"
              bg="white"
            />

            {/* <Input
              type="text"
              name="bloodBankName"
              value={formData.bloodBankName}
              onChange={handleChange}
              placeholder="Enter blood bank name"
              size="lg"
              focusBorderColor={brandColor}
              list="bloodBanks"
              bg={bg}
            />
            <datalist id="bloodBanks">
              {bloodBanks?.map((bank) => (
                <option key={bank._id} value={bank.name} />
              ))}
            </datalist> */}
          </FormControl>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">NIC Number</FormLabel>
                <Input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  placeholder="Enter NIC number"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              size="lg"
              focusBorderColor={brandColor}
              bg={bg}
            />
          </FormControl>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    size="lg"
                    focusBorderColor={brandColor}
                    bg={bg}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      variant="ghost"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      color={mutedText}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    size="lg"
                    focusBorderColor={brandColor}
                    bg={bg}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      variant="ghost"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      icon={
                        showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      color={mutedText}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>

          <Button
            type="submit"
            colorScheme="red"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Registering..."
            mt={4}
            width="full"
            height="50px"
            fontSize="lg"
            _hover={{ bg: "red.700" }}
            _active={{ bg: "red.800" }}
          >
            Register Admin
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddBBAdminForm;
