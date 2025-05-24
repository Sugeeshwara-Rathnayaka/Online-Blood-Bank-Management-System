import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../api/api";
import BloodBankSelect from "../select/BloodBankSelect";

export default function CreateCampaign() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    estimate: "",
    bloodBankName: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await api.post("/org/create-camp", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Campaign Created",
        description: "Your campaign was successfully created.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      window.location.reload(); // 🔄 Reload the page

      // Clear form
      setFormData({
        name: "",
        location: "",
        estimate: "",
        bloodBankName: "",
        date: "",
        time: "",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to create campaign.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      maxW="600px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Create New Campaign
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Campaign Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Little Hearts"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. St. Josph Collage"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Estimate (No. of Donors)</FormLabel>
            <Input
              type="number"
              name="estimate"
              value={formData.estimate}
              onChange={handleChange}
              placeholder="e.g. 200"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Blood Bank</FormLabel>
            <BloodBankSelect
              name="bloodBank"
              value={formData.bloodBankName}
              onChange={handleChange}
              placeholder="e.g. Ragama Hospital"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Time</FormLabel>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </FormControl>

          <Button
            colorScheme="red"
            type="submit"
            isLoading={loading}
            loadingText="Creating..."
          >
            Create Campaign
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
