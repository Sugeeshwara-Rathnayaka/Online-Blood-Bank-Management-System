import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Button,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  useMediaQuery,
  VStack,
  Divider,
  Stack,
  Spinner,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  FiDroplet,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiPlus,
  FiGrid,
  FiFileText,
  FiHome,
  FiTrash2,
} from "react-icons/fi";
import api from "../api/api";
import LiveClock from "../components/other/LiveClock";
import HospitalProfile from "../components/hospital/HospitalProfile";
import CreateBloodRequest from "../components/hospital/CreateBloodRequest";

// -------------------- Sidebar Component --------------------
const SidebarContent = ({ onClose, setActiveSection, activeSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.600">
      Hospital Dashboard
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiDroplet, label: "Request Blood", section: "request" },
      { icon: FiUser, label: "Find Donors", section: "donors" },
      { icon: FiUser, label: "Profile", section: "profile" },
      { icon: FiFileText, label: "View Report", section: "report" },
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

const HospitalDashboard = () => {
  // -------------------- State --------------------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  //const [criticalRequests, setCriticalRequests] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);

  // -------------------- Hooks --------------------
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  // -------------------- Theme Variables --------------------
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const secondaryText = useColorModeValue("gray.600", "gray.400");

  const hospitalStats = {
    totalRequests: bloodRequests.length,
    fulfilledRequests: bloodRequests.filter((r) => r.status === 3).length,
    pendingRequests: bloodRequests.filter((r) => r.status === 0).length,
    criticalRequests: bloodRequests.filter((r) => r.status === 2).length,
    rejectedRequests: bloodRequests.filter((r) => r.status === 4).length,
    proccessingRequests: bloodRequests.filter((r) => r.status === 1).length,
  };
  const successRate =
    hospitalStats.totalRequests > 0
      ? Math.floor(
          (hospitalStats.fulfilledRequests / hospitalStats.totalRequests) * 100
        )
      : 0;

  const STATUS_CONFIG = {
    0: { label: "Pending", icon: FiClock, color: "yellow" },
    1: { label: "Processing", icon: FiClock, color: "blue" },
    2: { label: "Critical", icon: FiAlertTriangle, color: "red" },
    3: { label: "Fulfilled", icon: FiCheckCircle, color: "green" },
    4: { label: "Rejected", icon: FiAlertTriangle, color: "gray" },
  };

  const getStatusBadge = (status, onClick) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[4];

    return (
      <Badge
        colorScheme={config.color}
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="md"
        cursor={onClick ? "pointer" : "default"}
        onClick={onClick}
      >
        <Icon as={config.icon} mr={1} />
        {config.label}
      </Badge>
    );
  };

  const StatCard = ({ label, value, color, helpText }) => (
    <Card bg={cardBg}>
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber color={color}>{value}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

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

  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/hos/all-req", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBloodRequests(res.data.requests || []);
      } catch (err) {
        console.error("Error fetching blood requests:", err);
      }
    };

    fetchBloodRequests();
  }, []);

  // const criticalRequests = bloodRequests.filter(
  //   (req) => req.status === 2 // status code 2 = Critical
  // );

  const openDeleteDialog = (req) => {
    setSelectedReq(req);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedReq(null);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/hos/delete-req/${selectedReq._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBloodRequests((prev) => prev.filter((r) => r._id !== selectedReq._id));

      toast({
        title: "Request Deleted",
        description: "Blood request has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeDeleteDialog();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to delete blood request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStatusToggle = async (request) => {
    const currentStatus = request.status;
    const newStatus = currentStatus === 0 ? 2 : currentStatus === 2 ? 0 : null;

    if (newStatus === null) return; // Only allow toggle between 0 and 2

    try {
      await api.put(
        `/hos/update-status/${request._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setBloodRequests((prev) =>
        prev.map((r) =>
          r._id === request._id ? { ...r, status: newStatus } : r
        )
      );

      toast({
        title: "Status Updated",
        description: `Request marked as ${
          newStatus === 2 ? "Critical" : "Pending"
        }.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to update status.", err);
      toast({
        title: "Error",
        description: "Failed to update status.",
        status: "error",
        duration: 3000,
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
  const { hospitalName = "" } = user;

  return (
    <>
      {/* Main Layout */}
      <Flex key="hospital-dashboard-layout" minH="100vh" bg="gray.50">
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
              activeSection={activeSection}
              setActiveSection={setActiveSection}
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
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        <Box flex={1} p={{ base: 4, md: 6 }}>
          {/* -------------------- Overview Section -------------------- */}
          {activeSection === "overview" && (
            <>
              {/* Hospital Header */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                mb={8}
              >
                <Box>
                  <Heading as="h1" size="xl" mb={2}>
                    Welcome Back, {hospitalName || "Hospital"}!
                  </Heading>
                  <Text color={secondaryText}>Welcome to your dashboard</Text>
                </Box>
                <Flex mt={{ base: 4, md: 0 }}>
                  <Button
                    colorScheme="red"
                    leftIcon={<Icon as={FiPlus} />}
                    mr={3}
                    onClick={() => setActiveSection("hospital")}
                  >
                    New Blood Request
                  </Button>
                  <Button
                    colorScheme="blue"
                    leftIcon={<Icon as={FiUser} />}
                    mr={3}
                    onClick={() => setActiveSection("donors")}
                  >
                    Find Compatible Donors
                  </Button>
                </Flex>
              </Flex>

              {/* Stats Overview */}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={4}
                mb={8}
              >
                <StatCard
                  label="Total Requests"
                  value={hospitalStats.totalRequests}
                  helpText="This month"
                />
                <StatCard
                  label="Fulfilled Requests"
                  value={hospitalStats.fulfilledRequests}
                  color="green.500"
                  helpText={`${successRate}% success rate`}
                />
                <StatCard
                  label="Critical Requests"
                  value={hospitalStats.criticalRequests}
                  color="red.500"
                  helpText={`${hospitalStats.pendingRequests} Pending`}
                />
                <StatCard
                  label="Processing Requests"
                  value={hospitalStats.proccessingRequests}
                  color="blue.500"
                  helpText={
                    hospitalStats.totalRequests === 0
                      ? "No requests yet"
                      : `${hospitalStats.rejectedRequests} Rejected`
                  }
                />
              </SimpleGrid>

              {/* Critical Alerts and Blood Inventory */}
              {/* <Grid gap={6} mb={8}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Critical Blood Requests</Heading>
                  </CardHeader>
                  <CardBody overflowX="auto">
                    {criticalRequests.length > 0 ? (
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Request ID</Th>
                            <Th>Patient</Th>
                            <Th>Blood Group</Th>
                            <Th>Units</Th>
                            <Th>Needed By</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {criticalRequests.map((request) => (
                            <Tr key={request._id}>
                              <Td fontWeight="bold">{request.requestId}</Td>
                              <Td>{request.patientName}</Td>
                              <Td>{request.bloodId?.type || "N/A"}</Td>
                              <Td>{request.amount}</Td>
                              <Td>
                                {new Date(
                                  request.dateNeeded
                                ).toLocaleDateString()}
                              </Td>
                              <Td>{getStatusBadge("critical")}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        No critical blood requests at this time
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </Grid> */}

              {/* All Blood Requests */}
              <Grid gap={6} mb={8}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">All Blood Requests</Heading>
                  </CardHeader>
                  <CardBody overflowX="auto">
                    {bloodRequests.length > 0 ? (
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Request ID</Th>
                            <Th>Patient</Th>
                            <Th>Blood Group</Th>
                            <Th>Units</Th>
                            <Th>Blood Bank</Th>
                            <Th>Needed Before</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {bloodRequests.slice(0, 6).map((request) => (
                            <Tr key={request._id}>
                              <Td fontWeight="bold">{request.requestId}</Td>
                              <Td>{request.patientName}</Td>
                              <Td>{request.bloodId?.type || "N/A"}</Td>
                              <Td>{request.amount}</Td>
                              <Td>{request.bloodBankId?.name || "N/A"}</Td>

                              <Td fontWeight="bold">
                                {new Date(
                                  request.dateNeeded
                                ).toLocaleDateString()}
                              </Td>

                              <Td>
                                {getStatusBadge(request.status, () => {
                                  if (
                                    request.status === 0 ||
                                    request.status === 2
                                  ) {
                                    handleStatusToggle(request);
                                  }
                                })}
                              </Td>
                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => openDeleteDialog(request)}
                                  isDisabled={
                                    !["0", "2", 0, 2].includes(request.status)
                                  } // allow only Pending (0) and Critical (2)
                                >
                                  <Icon as={FiTrash2} />
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        No recent blood requests
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </Grid>
            </>
          )}
          {activeSection === "profile" && <HospitalProfile />}
          {activeSection === "request" && <CreateBloodRequest />}
        </Box>
      </Flex>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Blood Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this blood request? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default HospitalDashboard;
