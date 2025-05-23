// -------------------- Imports --------------------
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Button,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Badge,
  VStack,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useMediaQuery,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import {
  FiDroplet,
  FiCalendar,
  FiAward,
  FiHeart,
  FiUser,
  FiClock,
  FiGrid,
  FiMapPin,
} from "react-icons/fi";

import api from "../api/api";
import BloodDonationForm from "../components/donor/BloodDonationForm";
import DonorProfile from "../components/donor/DonorProfile";
import DonorDonations from "../components/donor/DonorDonations";
import DonorCampaigns from "../components/donor/DonorCampaigns";

// -------------------- Sidebar Component --------------------
const SidebarContent = ({ onClose, setActiveSection, activeSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.600">
      Donor Dashboard
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiDroplet, label: "Donate Blood", section: "donate" },
      { icon: FiMapPin, label: "Campaigns", section: "campaigns" },
      { icon: FiHeart, label: "My Donations", section: "donations" },
      { icon: FiUser, label: "Profile", section: "profile" },
    ].map((item) => (
      <Button
        key={item.label}
        leftIcon={<item.icon />}
        justifyContent="flex-start"
        variant="ghost"
        colorScheme="red"
        _hover={{ bg: "red.50" }}
        _active={{ bg: "red.100" }}
        bg={activeSection === item.section ? "red.50" : "transparent"}
        onClick={() => {
          setActiveSection(item.section);
          onClose?.();
        }}
      >
        {item.label}
      </Button>
    ))}
  </VStack>
);

// -------------------- Main Component --------------------
const DonorDashboard = () => {
  // -------------------- State --------------------
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);

  // -------------------- Hooks --------------------
  const cancelRef = useRef();
  const toast = useToast();
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  // -------------------- Theme Variables --------------------
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const accentColor = "red.500";

  // -------------------- Fetch Profile --------------------
  useEffect(() => {
    // Async function to fetch the logged-in user's profile
    const fetchProfile = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");

        // Send request to /me endpoint with authorization header
        const res = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set user data into state
        setUser(res.data.user);
      } catch (err) {
        // Handle and log any errors
        setError("Failed to load profile");
        console.error("Failed to load Profile", err);
      } finally {
        // Set loading state to false regardless of outcome
        setLoading(false);
      }
    };

    // Immediately invoke the async function
    fetchProfile();
  }, []);

  // -------------------- Fetch Appointments --------------------
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/donor/all-res", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data.reservations || []);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  // -------------------- Delete Logic --------------------
  const openDeleteDialog = (res) => {
    setSelectedRes(res);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedRes(null);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/donor/delete-res/${selectedRes._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) => prev.filter((a) => a._id !== selectedRes._id));
      toast({
        title: "Reservation Cancelled",
        description: "Your appointment has been successfully deleted.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      closeDeleteDialog();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to delete reservation",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // -------------------- Conditional Loading/Error --------------------
  if (loading) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Stack align="center">
          <Spinner size="xl" color="red.500" />
          <Text mt={2}>Loading Dashboard...</Text>
        </Stack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  // -------------------- Derived Data --------------------
  const {
    firstName = "",
    bloodGroup = "Unknown",
    totalDonations = 0,
    level = "Beginner",
    nextEligibleDate = new Date(),
  } = user;

  const daysUntilNextDonation = Math.floor(
    (new Date(nextEligibleDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // -------------------- Render --------------------
  return (
    <>
      {/* Main Layout */}
      <Flex minH="100vh" bg="gray.50">
        {/* Sidebar / Drawer */}
        {isLargerThanMD ? (
          <Box
            w="280px"
            bg="white"
            borderRight="1px"
            borderColor={borderColor}
            h="100vh"
            position="sticky"
            top={0}
          >
            <SidebarContent
              setActiveSection={setActiveSection}
              activeSection={activeSection}
            />
          </Box>
        ) : (
          <Drawer
            isOpen={isDrawerOpen}
            placement="left"
            onClose={() => setIsDrawerOpen(false)}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <Flex align="center">
                  <Icon as={FiDroplet} color="red.500" mr={2} />
                  BloodHero
                </Flex>
              </DrawerHeader>
              <DrawerBody px={0}>
                <SidebarContent
                  onClose={() => setIsDrawerOpen(false)}
                  setActiveSection={setActiveSection}
                  activeSection={activeSection}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main Section Content */}
        <Box flex={1} p={{ base: 4, md: 8 }} maxW="100vw" overflowX="auto">
          {/* -------------------- Overview Section -------------------- */}
          {activeSection === "overview" && (
            <>
              {/* Welcome Card */}
              <Card
                bg={cardBg}
                mb={8}
                borderLeft="4px"
                borderColor={accentColor}
              >
                <CardBody>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                  >
                    <Box>
                      <Heading size="md" mb={2}>
                        Welcome back, {firstName}!
                      </Heading>
                      <Text color={secondaryText}>
                        Your contributions have saved {totalDonations * 3} lives
                      </Text>
                    </Box>
                    <Box mt={{ base: 4, md: 0 }} textAlign="right">
                      <Text fontWeight="bold" color={accentColor}>
                        {bloodGroup}
                      </Text>
                      <Text color={secondaryText} fontSize="sm">
                        {level} Donor
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* Stats */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Donations</StatLabel>
                      <StatNumber color={accentColor}>
                        {totalDonations}
                      </StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />2 more than last year
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Next Donation</StatLabel>
                      <StatNumber>
                        {daysUntilNextDonation > 0
                          ? `${daysUntilNextDonation} days`
                          : "Eligible now"}
                      </StatNumber>
                      <StatHelpText>
                        <Icon as={FiClock} mr={1} />
                        {new Date(nextEligibleDate).toLocaleDateString()}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Quick Actions */}
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={8}>
                <Button
                  leftIcon={<FiCalendar />}
                  variant="outline"
                  colorScheme="red"
                  onClick={() => setActiveSection("donate")}
                >
                  Book Appointment
                </Button>
                <Button
                  leftIcon={<FiMapPin />}
                  variant="outline"
                  colorScheme="red"
                  onClick={() => setActiveSection("campaigns")}
                >
                  Find Campaigns
                </Button>
                <Button
                  leftIcon={<FiAward />}
                  variant="outline"
                  colorScheme="red"
                  onClick={() => setActiveSection("donations")}
                >
                  My Donations
                </Button>
              </SimpleGrid>

              {/* Upcoming Appointments */}
              {appointments.length > 0 && (
                <Card bg={cardBg} mb={8}>
                  <CardHeader>
                    <Heading size="md">Upcoming Appointments</Heading>
                  </CardHeader>
                  <CardBody>
                    {appointments.map((appt) => (
                      <Card
                        key={appt._id}
                        variant="outline"
                        borderLeft="4px"
                        borderColor="green.400"
                        mb={4}
                      >
                        <CardBody>
                          <Flex justify="space-between" align="center">
                            <Box>
                              <Text fontWeight="bold">
                                {new Date(appt.date).toLocaleDateString()}
                              </Text>
                              <Text color={secondaryText}>{appt.time}</Text>
                              <Text>
                                ID: <strong>{appt.reservationId}</strong>
                              </Text>
                              <Text>
                                {appt.bloodBankId?.name || "Unknown Blood Bank"}
                              </Text>
                            </Box>
                            <Box textAlign="right">
                              <Badge
                                colorScheme={
                                  appt.flag === 1
                                    ? "green"
                                    : appt.flag === 2
                                    ? "red"
                                    : "yellow"
                                }
                              >
                                {appt.flag === 1
                                  ? "Approved"
                                  : appt.flag === 2
                                  ? "Rejected"
                                  : "Pending"}
                              </Badge>
                              {appt.flag !== 1 && (
                                <Button
                                  size="sm"
                                  mt={2}
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => openDeleteDialog(appt)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Box>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </CardBody>
                </Card>
              )}

              {/* Recent Donations */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Recent Donations</Heading>
                    <Button
                      as={RouterLink}
                      to="/donations"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                    >
                      View All
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {user.recentDonations?.length ? (
                      user.recentDonations.map((d) => (
                        <Box
                          key={d.id}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          borderColor={borderColor}
                        >
                          <Text fontWeight="bold">
                            {new Date(d.date).toLocaleDateString()}
                          </Text>
                          <Text>{d.location}</Text>
                          <Text color={secondaryText}>{d.volume}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text color={secondaryText}>No donations found.</Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}

          {/* Other Sections */}
          {activeSection === "donate" && <BloodDonationForm />}
          {activeSection === "campaigns" && <DonorCampaigns />}
          {activeSection === "donations" && <DonorDonations />}
          {activeSection === "profile" && <DonorProfile />}
        </Box>
      </Flex>

      {/* -------------------- Delete Confirmation Dialog -------------------- */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Reservation
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to cancel your reservation on{" "}
              <strong>
                {new Date(selectedRes?.date).toLocaleDateString()}
              </strong>{" "}
              at <strong>{selectedRes?.time}</strong>? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                No
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Yes, Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DonorDashboard;
