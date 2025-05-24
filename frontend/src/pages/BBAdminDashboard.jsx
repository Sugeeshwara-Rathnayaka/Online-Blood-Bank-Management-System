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
  CardFooter,
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
  Tag,
  Alert,
  AlertIcon,
  Progress,
  VStack,
  Stack,
  Spinner,
  useMediaQuery,
  Divider,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FiDroplet,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiActivity,
  FiPackage,
  FiTruck,
  FiUsers,
  FiBarChart2,
  FiUser,
  FiFileText,
  FiGrid,
  FiTrash2,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import api from "../api/api";
import CreateBloodRequest from "../components/bloodBankAdmin/CreateBloodRequest";
import DonorAppointments from "../components/bloodBankAdmin/DonorAppointment";
import DonorAppointmentsTable from "../components/bloodBankAdmin/DonorAppointment";
import CampaignReservationsTable from "../components/bloodBankAdmin/CampaignReservationsTable";

// -------------------- Sidebar Component --------------------
const SidebarContent = ({ onClose, setActiveSection, activeSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.600">
      BloodBank Hospital Dashboard
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiDroplet, label: "Request Blood", section: "request" },
      { icon: FiUser, label: "Donor Appointments", section: "donors" },
      { icon: FiUser, label: "Campaigns Requests", section: "orgcamps" },
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

const BloodBankAdminDashboard = () => {
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const toast = useToast();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Hooks
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  // Theme Variables
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const criticalColor = useColorModeValue("red.500", "red.300");
  const warningColor = useColorModeValue("orange.500", "orange.300");

  const pendingStats = {
    criticalRequests: pendingRequests.filter((r) => r.status === 2).length,
    processingRequests: pendingRequests.filter((r) => r.status === 1).length,
    fulfilledRequests: pendingRequests.filter((r) => r.status === 3).length,
  };
  const rFromBB = {
    highPriiorityRequests: receivedRequests.filter((r) => r.priority === "High")
      .length,
  };

  //Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Failed to load Profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bbadmin/myReceived-req", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReceivedRequests(res.data.requests);
      } catch (error) {
        console.error("Failed to fetch received requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedRequests();
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bbadmin/normal-req", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(res.data.requests); // Assuming the response shape
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bbadmin/mySent-req", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Map raw data to UI-friendly activity format
        const activities = res.data.requests.map((req) => ({
          name: req.firstName,
          id: req._id,
          description: `Requested ${req.amount} unit(s) of ${
            req.bloodType
          } from ${req.receiverId?.name || "Unknown"}`,
          timestamp: new Date(req.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          performedBy: `${req.priority || "Unknown"}`,
        }));
        setSentRequests(activities);
      } catch (err) {
        console.error("Failed to fetch sent requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  const handlePriorityChange = async (requestId, currentPriority) => {
    const newPriority = currentPriority === "High" ? "Normal" : "High";

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/bbadmin/update-priority/${requestId}`,
        { priority: newPriority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, performedBy: newPriority } : req
        )
      );

      toast({
        title: "Priority updated",
        description: `Priority changed to ${newPriority}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Failed to update priority:", err);
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Could not update priority",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Mock data - replace with real data from API
  const bloodBankStats = {
    name: "City Central Blood Bank",
    totalInventory: 156,
    criticalLevels: 3,
    pendingDonations: 8,
    fulfilledRequests: 24,
    bloodGroups: {
      "A+": { current: 10, threshold: 15 },
      "A-": { current: 8, threshold: 5 },
      "B+": { current: 18, threshold: 12 },
      "B-": { current: 6, threshold: 4 },
      "AB+": { current: 5, threshold: 3 },
      "AB-": { current: 2, threshold: 2 },
      "O+": { current: 32, threshold: 20 },
      "O-": { current: 10, threshold: 6 },
    },
  };

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

  const handleStatusChange = async (requestId, targetStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/bbadmin/update-status/${requestId}`,
        { status: targetStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPendingRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: targetStatus } : req
        )
      );

      toast({
        title: "Status Updated",
        description: `Changed to ${STATUS_CONFIG[targetStatus].label}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Status update failed:", err);
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Could not update status",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/bbadmin/delete-req/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSentRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Request Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Failed to delete request:", err);
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message || "Could not delete request",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const getPriorityTag = (priority, onClick) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return (
          <Tag colorScheme="red" size="sm" cursor="pointer" onClick={onClick}>
            High
          </Tag>
        );
      case "normal":
        return (
          <Tag colorScheme="blue" size="sm" cursor="pointer" onClick={onClick}>
            Normal
          </Tag>
        );
      default:
        return (
          <Tag colorScheme="gray" size="sm" cursor="pointer" onClick={onClick}>
            {priority || "Unknown"}
          </Tag>
        );
    }
  };

  const getInventoryStatus = (current, threshold) => {
    const percentage = (current / threshold) * 100;
    if (percentage <= 50) return "critical";
    if (percentage <= 80) return "warning";
    return "healthy";
  };

  const StatCard = ({
    label,
    value,
    icon,
    iconColor,
    valueColor = "inherit",
    helpText,
  }) => (
    <Card bg={cardBg}>
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber color={valueColor}>{value}</StatNumber>
          <StatHelpText>
            <Icon as={icon} mr={1} color={iconColor} />
            {helpText}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

  // Conditional Loading/Error
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

  //  Derived Data
  const { firstName = "", lastName = "", bloodBankId = "" } = user;

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
          {/* Overview Section */}
          {activeSection === "overview" && (
            <>
              {/* Header */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                mb={8}
              >
                <Box>
                  <Heading as="h1" size="xl" mb={2}>
                    {bloodBankId.name} Dashboard
                  </Heading>
                  <Text color={secondaryText}>
                    Admin: {firstName} {lastName}
                  </Text>
                </Box>
                <Flex mt={{ base: 4, md: 0 }}>
                  <Button
                    onClick={() => setActiveSection("request")}
                    colorScheme="red"
                    leftIcon={<Icon as={FiPlus} />}
                    mr={3}
                  >
                    Request Blood
                  </Button>
                  <Button
                    onClick={() => setActiveSection("inventory")}
                    mr={3}
                    leftIcon={<Icon as={FiPackage} />}
                  >
                    Manage Inventory
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
                  label="Total Inventory"
                  value={bloodBankStats.totalInventory}
                  icon={FiDroplet}
                  iconColor="red.500"
                  helpText="Blood units"
                />
                <StatCard
                  label="Critical Alerts"
                  value={pendingStats.criticalRequests}
                  icon={FiAlertTriangle}
                  iconColor={criticalColor}
                  valueColor={criticalColor}
                  helpText={`${rFromBB.highPriiorityRequests} High Priority`}
                />
                <StatCard
                  label="Processing Requests"
                  value={pendingStats.processingRequests}
                  icon={FiClock}
                  iconColor="blue.500"
                  valueColor="blue.500"
                  helpText="To be processed"
                />
                <StatCard
                  label="Fulfilled Requests"
                  value={pendingStats.fulfilledRequests}
                  icon={FiCheckCircle}
                  iconColor="green.500"
                  valueColor="green.500"
                  helpText="This month"
                />
              </SimpleGrid>

              {/* Pending Requests */}
              <Grid gap={6} mb={8}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Pending Hospitals Requests</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Spinner size="md" color="red.500" />
                    ) : pendingRequests.length > 0 ? (
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Request ID</Th>
                            <Th>Hospital</Th>
                            <Th>Blood Group</Th>
                            <Th>Units</Th>
                            <Th>Needed Before</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {pendingRequests.map((request) => (
                            <Tr key={request._id}>
                              <Td fontWeight="semibold">{request.requestId}</Td>
                              <Td>
                                {request.hospitalId?.hospitalName || "N/A"}
                              </Td>
                              <Td>{request.bloodId?.type}</Td>
                              <Td>{request.amount} Units</Td>
                              <Td>
                                {new Date(
                                  request.dateNeeded
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </Td>
                              <Td>
                                <Popover
                                  isOpen={openPopoverId === request._id}
                                  onClose={() => setOpenPopoverId(null)}
                                  placement="bottom-start"
                                >
                                  <PopoverTrigger>
                                    <Box
                                      as="span"
                                      cursor="pointer"
                                      onClick={() =>
                                        setOpenPopoverId(
                                          openPopoverId === request._id
                                            ? null
                                            : request._id
                                        )
                                      }
                                    >
                                      {getStatusBadge(request.status)}
                                    </Box>
                                  </PopoverTrigger>
                                  <PopoverContent w="180px">
                                    <PopoverArrow />
                                    <PopoverBody>
                                      <VStack align="stretch" spacing={1}>
                                        {[0, 1, 2, 3, 4].map((status) => (
                                          <Button
                                            key={status}
                                            size="sm"
                                            variant="ghost"
                                            justifyContent="start"
                                            onClick={() => {
                                              handleStatusChange(
                                                request._id,
                                                status
                                              );
                                              setOpenPopoverId(null); // ✅ close popover after selection
                                            }}
                                            leftIcon={
                                              <Icon
                                                as={STATUS_CONFIG[status].icon}
                                                color={`${STATUS_CONFIG[status].color}.500`}
                                              />
                                            }
                                          >
                                            {STATUS_CONFIG[status].label}
                                          </Button>
                                        ))}
                                      </VStack>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        No pending blood requests
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </Grid>

              {/* Requests From and To Blood Banks */}
              <Grid
                templateColumns={{ base: "1fr", lg: "4fr 3fr" }}
                gap={6}
                mb={8}
              >
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Requests From Blood Banks</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Spinner size="md" color="red.500" />
                    ) : receivedRequests.length > 0 ? (
                      <Table variant="simple" size="md">
                        <Thead>
                          <Tr>
                            <Th>Blood Bank</Th>
                            <Th>Blood Group</Th>
                            <Th>Amount</Th>
                            <Th>Date</Th>
                            <Th>Priority</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {receivedRequests.map((req) => (
                            <Tr key={req._id}>
                              <Td>{req.senderId?.name || "N/A"}</Td>
                              <Td>{req.bloodType}</Td>
                              <Td>{req.amount} Units</Td>
                              <Td>
                                {new Date(req.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </Td>
                              <Td> {getPriorityTag(req.priority)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        No Requests Received
                      </Alert>
                    )}
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Requests To Blood Banks</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Spinner size="md" color="red.500" />
                    ) : sentRequests.length > 0 ? (
                      <VStack align="stretch" spacing={3}>
                        {sentRequests.map((activity) => (
                          <Flex
                            key={activity.id}
                            p={3}
                            borderWidth="1px"
                            borderRadius="md"
                            align="center"
                            justify="space-between" // ADD THIS
                          >
                            <Flex align="center">
                              <Box
                                p={2}
                                mr={3}
                                bg="blue.50"
                                borderRadius="full"
                                color="blue.500"
                              >
                                <Icon as={FiActivity} />
                              </Box>
                              <Box>
                                <Text fontWeight="medium">
                                  {activity.description}
                                </Text>
                                <Text fontSize="sm" color={secondaryText}>
                                  {activity.timestamp} •{" "}
                                  {getPriorityTag(activity.performedBy, () =>
                                    handlePriorityChange(
                                      activity.id,
                                      activity.performedBy
                                    )
                                  )}
                                </Text>
                              </Box>
                            </Flex>
                            <Button
                              onClick={() => {
                                setSelectedRequestId(activity.id);
                                setIsAlertOpen(true);
                              }}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                            >
                              <Icon as={FiTrash2} />
                            </Button>
                          </Flex>
                        ))}
                      </VStack>
                    ) : (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        No recent activities
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </Grid>

              {/* Inventory Status and Quick Actions */}
              <Grid
                templateColumns={{ base: "1fr", lg: "4fr 3fr" }}
                gap={6}
                mb={8}
              >
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Blood Inventory Status</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                      {Object.entries(bloodBankStats.bloodGroups).map(
                        ([bloodGroup, { current, threshold }]) => {
                          const status = getInventoryStatus(current, threshold);
                          return (
                            <Box key={bloodGroup}>
                              <Flex justify="space-between" mb={1}>
                                <Text fontWeight="bold">{bloodGroup}</Text>
                                <Text>
                                  <Text
                                    as="span"
                                    color={
                                      status === "critical"
                                        ? criticalColor
                                        : status === "warning"
                                        ? warningColor
                                        : "inherit"
                                    }
                                    fontWeight="bold"
                                  >
                                    {current}
                                  </Text>{" "}
                                  / {threshold} units
                                </Text>
                              </Flex>
                              <Progress
                                value={(current / threshold) * 100}
                                size="sm"
                                colorScheme={
                                  status === "critical"
                                    ? "red"
                                    : status === "warning"
                                    ? "orange"
                                    : "green"
                                }
                                borderRadius="full"
                              />
                            </Box>
                          );
                        }
                      )}
                    </SimpleGrid>
                  </CardBody>
                  <CardFooter>
                    <Button
                      as={RouterLink}
                      to="/inventory"
                      variant="ghost"
                      colorScheme="blue"
                      size="sm"
                    >
                      View Detailed Inventory
                    </Button>
                  </CardFooter>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      <Button
                        as={RouterLink}
                        to="/donations/process"
                        colorScheme="red"
                        leftIcon={<Icon as={FiDroplet} />}
                        height="100px"
                        flexDirection="column"
                      >
                        <Text fontSize="lg">Process</Text>
                        <Text fontSize="sm" fontWeight="normal">
                          New Donation
                        </Text>
                      </Button>

                      <Button
                        as={RouterLink}
                        to="/requests/fulfill"
                        colorScheme="blue"
                        leftIcon={<Icon as={FiTruck} />}
                        height="100px"
                        flexDirection="column"
                      >
                        <Text fontSize="lg">Fulfill</Text>
                        <Text fontSize="sm" fontWeight="normal">
                          Blood Request
                        </Text>
                      </Button>

                      <Button
                        as={RouterLink}
                        to="/donors"
                        colorScheme="green"
                        leftIcon={<Icon as={FiUsers} />}
                        height="100px"
                        flexDirection="column"
                      >
                        <Text fontSize="lg">Manage</Text>
                        <Text fontSize="sm" fontWeight="normal">
                          Donors
                        </Text>
                      </Button>

                      <Button
                        as={RouterLink}
                        to="/reports"
                        colorScheme="purple"
                        leftIcon={<Icon as={FiBarChart2} />}
                        height="100px"
                        flexDirection="column"
                      >
                        <Text fontSize="lg">Generate</Text>
                        <Text fontSize="sm" fontWeight="normal">
                          Reports
                        </Text>
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </Grid>
            </>
          )}
          {activeSection === "profile" && <HospitalProfile />}
          {activeSection === "request" && <CreateBloodRequest />}
          {activeSection === "donors" && <DonorAppointmentsTable />}
          {activeSection === "orgcamps" && <CampaignReservationsTable />}
        </Box>
      </Flex>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this request? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDeleteRequest(selectedRequestId);
                  setIsAlertOpen(false);
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default BloodBankAdminDashboard;
