import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../api/api";
import BloodBankSelect from "../select/BloodBankSelect";
import BloodTypeSelect from "../select/BloodTypeSelect";

const CreateBloodRequest = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    units: "",
    bloodBankName: "",
    dateNeeded: "",
  });

  const toast = useToast();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await api.post("/hos/blood-req", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Request Created",
        description: "Blood request submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        patientName: "",
        bloodType: "",
        units: "",
        bloodBankName: "",
        dateNeeded: "",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to create blood request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={6}
      p={6}
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      <Heading size="md" mb={4}>
        Create Blood Request
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Patient Name</FormLabel>
            <Input
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Blood Type</FormLabel>
            <BloodTypeSelect
              value={formData.bloodType}
              onChange={handleChange}
              placeholder="Select Blood Type"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Units Needed</FormLabel>
            <Input
              name="units"
              type="number"
              min={1}
              value={formData.units}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Blood Bank</FormLabel>
            <BloodBankSelect
              name="bloodBankName"
              value={formData.bloodBank}
              onChange={handleChange}
              placeholder="Select Blood Bank"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date Needed</FormLabel>
            <Input
              name="dateNeeded"
              type="date"
              value={formData.dateNeeded}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="red">
            Submit Request
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateBloodRequest;
