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
  Select,
  Grid,
  GridItem,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from "@chakra-ui/react";
import api from "../../api/api";

// List of districts for the dropdown
const DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const AddBloodBankForm = ({ onSuccess }) => {
  // Color variables with dark mode support
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("red.600", "red.500");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    capacity: "",
    contactNumber: "",
  });

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

  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/superadmin/add-bbhos", formData);

      toast({
        title: "Blood Bank Added",
        description: `${formData.name} has been successfully added.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      if (onSuccess) onSuccess();

      // Reset form after successful submission
      setFormData({
        name: "",
        address: "",
        district: "",
        capacity: "",
        contactNumber: "",
      });
    } catch (err) {
      console.error("Error adding blood bank:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add blood bank";
      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
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
        Register New Blood Bank
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
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Blood Bank Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. National Blood Center"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">District</FormLabel>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Select district"
                  size="lg"
                  focusBorderColor={brandColor}
                  bg={bg}
                >
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Capacity</FormLabel>
                <NumberInput
                  min={1}
                  value={formData.capacity}
                  onChange={(value) => handleNumberChange("capacity", value)}
                >
                  <NumberInputField
                    placeholder="e.g. 500"
                    size="lg"
                    focusBorderColor={brandColor}
                    bg={bg}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl>
            <FormLabel fontWeight="semibold">Contact Number</FormLabel>
            <Input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. 0112345678"
              size="lg"
              focusBorderColor={brandColor}
              bg={bg}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">Address</FormLabel>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address of the blood bank"
              size="lg"
              rows={3}
              focusBorderColor={brandColor}
              bg={bg}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="red"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            mt={4}
            width="full"
            height="50px"
            fontSize="lg"
            _hover={{ bg: "red.700" }}
            _active={{ bg: "red.800" }}
          >
            Register Blood Bank
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddBloodBankForm;
