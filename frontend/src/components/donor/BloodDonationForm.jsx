import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiInfo,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../api/api";
import BloodBankSelect from "../select/BloodBankSelect";

const BloodDonationForm = () => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.400");

  const [formData, setFormData] = useState({
    bloodBankName: "",
    date: "",
    time: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
      } catch (err) {
        toast({
          title: "Error loading form data",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await api.post("/donor/create-res", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Reservation Successful!",
        description: "Your blood donation appointment has been booked.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Submission failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Center minH="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box px={{ base: 4, md: 6 }} py={6} maxW="800px" mx="auto">
      <form onSubmit={handleSubmit}>
        <Card
          bg={cardBg}
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
        >
          <CardHeader pb={0}>
            <Heading size="lg" mb={1}>
              Book a Blood Donation
            </Heading>
            <Text fontSize="sm" color={secondaryText}>
              Please fill in your details to schedule a donation.
            </Text>
          </CardHeader>

          <CardBody pt={4}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center">
                    <FiMapPin style={{ marginRight: "0.5rem" }} />
                    Blood Bank
                  </FormLabel>
                  <BloodBankSelect
                    value={formData.bloodBankName}
                    onChange={handleChange}
                    brandColor="red.500"
                    bg="white"
                    placeholder="Select a blood bank"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center">
                    <FiCalendar style={{ marginRight: "0.5rem" }} />
                    Date
                  </FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center">
                    <FiClock style={{ marginRight: "0.5rem" }} />
                    Time (9:00 AM – 4:00 PM)
                  </FormLabel>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    step="900"
                    min="09:00"
                    max="16:00"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>

          <CardFooter>
            <Flex justify="flex-end" w="full">
              <Button
                colorScheme="red"
                type="submit"
                isLoading={isSubmitting}
                size="lg"
              >
                Submit Reservation
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </form>

      {/* Helpful Information Section */}
      <Box mt={10}>
        <Heading size="md" display="flex" alignItems="center" mb={2}>
          <FiInfo style={{ marginRight: "0.5rem" }} />
          Before You Donate
        </Heading>
        <Text mb={2} fontSize="sm">
          • Eat iron-rich meals the day before (spinach, lentils, red meat).
          <br />
          • Drink plenty of water (at least 500ml before donating).
          <br />
          • Avoid heavy workouts or alcohol 24 hours before.
          <br />• Bring your NIC or donor ID on the day of the appointment.
        </Text>

        <Divider my={6} />

        <Heading size="md" display="flex" alignItems="center" mb={2}>
          <FiInfo style={{ marginRight: "0.5rem" }} />
          Eligibility Requirements
        </Heading>
        <Text fontSize="sm">
          • Age 18 to 60 years
          <br />
          • Minimum weight of 50kg
          <br />
          • Good general health (no flu, infections)
          <br />• No tattoos or piercings in the last 6 months
        </Text>
      </Box>
    </Box>
  );
};

export default BloodDonationForm;
