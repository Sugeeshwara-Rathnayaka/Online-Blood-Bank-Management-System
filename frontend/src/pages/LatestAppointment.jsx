import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListIcon,
  Stack,
  Tag,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDroplet,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

const AppointmentDetails = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const { user } = useAuth();

  // Mock appointment data - replace with API call
  const appointment = {
    id: "APT-2023-0015",
    date: "2025-08-20",
    time: "10:00 AM",
    location: "Ragama Hospital",
    status: "confirmed", // 'confirmed', 'pending', 'cancelled', 'completed'
    //donationType: "Whole Blood",
    bloodGroup: "A+",
    duration: "45 mins",
    preparationNotes: [
      "Bring your donor ID card",
      "Drink plenty of water before coming",
      "Avoid fatty foods 2 hours before donation",
    ],
    staff: {
      name: "Dr. Samantha Perera",
      role: "Donation Specialist",
      avatar: "",
    },
  };

  const handleCancel = async () => {
    try {
      await api.delete(`/appointments/${appointment.id}`);
      toast({
        title: "Appointment Cancelled",
        description: "Your donation appointment has been cancelled.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/donor-dashboard");
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description:
          error.response?.data?.message || "Could not cancel appointment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReschedule = () => {
    navigate("/appointments/new");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge colorScheme="green" px={2} py={1} borderRadius="full">
            <Flex align="center">
              <Icon as={FiCheckCircle} mr={1} />
              Confirmed
            </Flex>
          </Badge>
        );
      case "pending":
        return (
          <Badge colorScheme="yellow" px={2} py={1} borderRadius="full">
            <Flex align="center">
              <Icon as={FiAlertCircle} mr={1} />
              Pending Approval
            </Flex>
          </Badge>
        );
      case "cancelled":
        return (
          <Badge colorScheme="red" px={2} py={1} borderRadius="full">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge colorScheme="gray" px={2} py={1} borderRadius="full">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Button
        as={RouterLink}
        to="/donor-dashboard"
        leftIcon={<FiArrowLeft />}
        variant="outline"
        mb={6}
      >
        Back to Dashboard
      </Button>

      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        {/* Appointment Details Card */}
        <Box flex={2}>
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center" wrap="wrap">
                <Heading size="lg">Appointment Details</Heading>
                {getStatusBadge(appointment.status)}
              </Flex>
              <Text color={secondaryText} mt={2}>
                Appointment ID: {appointment.id}
              </Text>
            </CardHeader>

            <CardBody>
              <Stack spacing={6}>
                {/* Basic Info */}
                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                  <Box flex={1}>
                    <Text fontSize="sm" color={secondaryText}>
                      Date & Time
                    </Text>
                    <Flex align="center" mt={1}>
                      <Icon as={FiCalendar} mr={2} />
                      <Text fontWeight="medium">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Text>
                    </Flex>
                    <Flex align="center" mt={2}>
                      <Icon as={FiClock} mr={2} />
                      <Text fontWeight="medium">{appointment.time}</Text>
                      <Tag ml={3} size="sm" colorScheme="blue">
                        {appointment.duration}
                      </Tag>
                    </Flex>
                  </Box>

                  <Box flex={1}>
                    <Text fontSize="sm" color={secondaryText}>
                      Location
                    </Text>
                    <Flex align="center" mt={1}>
                      <Icon as={FiMapPin} mr={2} />
                      <Text fontWeight="medium">{appointment.location}</Text>
                    </Flex>

                    {/* <Text fontSize="sm" color={secondaryText} mt={4}>
                      Donation Type
                    </Text>
                    <Flex align="center" mt={1}>
                      <Icon as={FiDroplet} mr={2} />
                      <Text fontWeight="medium">
                        {appointment.donationType}
                      </Text>
                    </Flex> */}
                  </Box>
                </Flex>

                <Divider />

                {/* Donor Info */}
                <Box>
                  <Text fontSize="sm" color={secondaryText} mb={2}>
                    Your Information
                  </Text>
                  <Flex align="center">
                    <Avatar
                      size="md"
                      name={user?.name}
                      src={user?.avatar}
                      bg="red.100"
                      icon={<FiUser fontSize="1.2rem" />}
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="medium">{user?.name}</Text>
                      <Flex align="center" mt={1}>
                        <Text fontSize="sm" color={secondaryText}>
                          Blood Group:{" "}
                        </Text>
                        <Tag ml={2} colorScheme="red" size="sm">
                          {appointment.bloodGroup}
                        </Tag>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Divider />

                {/* Staff Info */}
                <Box>
                  <Text fontSize="sm" color={secondaryText} mb={2}>
                    Assigned Staff
                  </Text>
                  <Flex align="center">
                    <Avatar
                      size="md"
                      name={appointment.staff.name}
                      src={appointment.staff.avatar}
                      bg="blue.100"
                      icon={<FiUser fontSize="1.2rem" />}
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="medium">{appointment.staff.name}</Text>
                      <Text fontSize="sm" color={secondaryText}>
                        {appointment.staff.role}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                <Divider />

                {/* Preparation Notes */}
                <Box>
                  <Text fontSize="sm" color={secondaryText} mb={2}>
                    Preparation Notes
                  </Text>
                  <List spacing={2}>
                    {appointment.preparationNotes.map((note, index) => (
                      <ListItem key={index}>
                        <Flex align="flex-start">
                          <ListIcon
                            as={FiCheckCircle}
                            color="green.500"
                            mt={1}
                          />
                          <Text>{note}</Text>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </CardBody>

            <CardFooter>
              <Flex justify="space-between" w="full">
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={handleCancel}
                  isDisabled={["cancelled", "completed"].includes(
                    appointment.status
                  )}
                >
                  Cancel Appointment
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleReschedule}
                  isDisabled={["cancelled", "completed"].includes(
                    appointment.status
                  )}
                >
                  Reschedule
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </Box>

        {/* Quick Actions & Tips */}
        <Box flex={1}>
          <Card bg={cardBg} mb={6}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/donation-history"
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FiDroplet />}
                >
                  View Donation History
                </Button>
                <Button
                  as={RouterLink}
                  to="/appointments/new"
                  colorScheme="red"
                  leftIcon={<FiCalendar />}
                >
                  Book New Appointment
                </Button>
              </Stack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Donation Tips</Heading>
            </CardHeader>
            <CardBody>
              <Text fontWeight="bold" mb={2}>
                Before Donation:
              </Text>
              <Text mb={4} fontSize="sm">
                • Hydrate well 24 hours before
                <br />
                • Eat iron-rich foods
                <br />• Avoid alcohol 24 hours prior
              </Text>

              <Text fontWeight="bold" mb={2}>
                After Donation:
              </Text>
              <Text fontSize="sm">
                • Drink extra fluids
                <br />
                • Avoid heavy lifting
                <br />• Eat a healthy meal
              </Text>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default AppointmentDetails;
