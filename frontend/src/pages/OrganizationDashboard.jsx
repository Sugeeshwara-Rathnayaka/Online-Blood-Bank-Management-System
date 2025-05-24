import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  useToast,
  useMediaQuery,
  useColorModeValue,
  Stack,
  Spinner,
  VStack,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Badge,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiDroplet,
  FiCalendar,
  FiAlertCircle,
  FiPlus,
  FiGrid,
  FiAward,
  FiUser,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { StatsCard } from "../components/StatsCard";
import OrganizationProfile from "../components/organization/OrganizationProfile";
import api from "../api/api";
import CreateCampaign from "../components/organization/CreateCampaign";

const SidebarContent = ({ onClose, setActiveSection, activeSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.600">
      Organization Dashboard
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiAward, label: "Create Campaign", section: "campaigns" },
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

export default function OrganizationDashboard() {
  const toast = useToast();
  const cancelRef = useRef();
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const secondaryText = useColorModeValue("gray.600", "gray.400");

  const campStats = {
    totalCamps: campaigns.length,
    pendingCampaigns: campaigns.filter((r) => r.flag === 0).length,
    rejectedCampaigns: campaigns.filter((r) => r.flag === 2).length,
    activeCampaigns: campaigns.filter((r) => r.flag === 1).length,
  };

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Profile Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAllCamps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/org/all-camp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(res.data.campaigns); // Assuming `res.data.campaigns` holds the array
      } catch (err) {
        toast({
          title: "Error fetching campaigns",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchAllCamps();
  }, [toast]);

  // Delete Cmapaign
  const openDeleteDialog = (camp) => {
    setSelectedCamp(camp);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedCamp(null);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/org/delete-camp/${selectedCamp._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns((prev) => prev.filter((r) => r._id !== selectedCamp._id));
      toast({
        title: "Request Deleted",
        description: "Campaign has been Deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeDeleteDialog();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to delete Campaign!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const STATUS_CONFIG = {
    0: { label: "Pending", icon: FiClock, color: "yellow" },
    1: { label: "Approved", icon: FiCheckCircle, color: "green" },
    2: { label: "Rejected", icon: FiAlertTriangle, color: "red" },
  };

  const flagStatusBadge = (status, onClick) => {
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

  return (
    <>
      <Flex minH="100vh" bg="gray.50">
        {isLargerThanMD ? (
          <Box w="280px" bg="white" borderRight="1px" borderColor={borderColor}>
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
          {activeSection === "overview" && (
            <>
              <Flex
                justify="space-between"
                align="center"
                direction={{ base: "column", md: "row" }}
                mb={8}
              >
                <Box>
                  <Heading as="h1" size="xl" mb={2}>
                    Welcome Back, {user.organizationName || "Hospital"}!
                  </Heading>
                  <Text color={secondaryText}>Welcome to your dashboard</Text>
                </Box>
                <Button
                  colorScheme="red"
                  leftIcon={<FiPlus />}
                  mt={{ base: 4, md: 0 }}
                  onClick={() => setActiveSection("campaigns")}
                >
                  New Campaign
                </Button>
              </Flex>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={4}
                mb={8}
              >
                <StatsCard
                  icon={FiUsers}
                  title="Total Campaigns"
                  value={campStats.totalCamps || 0}
                  trend="+12% this month"
                  color="blue"
                />
                <StatsCard
                  icon={FiDroplet}
                  title="Blood Inventory"
                  value={campStats.bloodInventory || 0}
                  unit="units"
                  trend="+5% this week"
                  color="green"
                />
                <StatsCard
                  icon={FiCalendar}
                  title="Active Campaigns"
                  value={campStats.activeCampaigns || 0}
                  trend="2 ending soon"
                  color="purple"
                />
                <StatsCard
                  icon={FiClock}
                  title="Pending Campaigns"
                  value={campStats.pendingCampaigns || 0}
                  trend={`Rejected: ${campStats.rejectedCampaigns || 0}`}
                  color="orange"
                />
              </SimpleGrid>

              <Grid gap={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">All Campaigns</Heading>
                  </CardHeader>
                  <CardBody overflowX="auto">
                    {campaigns.length > 0 ? (
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Campaign ID</Th>
                            <Th>Name</Th>
                            <Th>Location</Th>
                            <Th>Blood Bank</Th>
                            <Th>Date & Time</Th>
                            <Th>Estimate</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {campaigns.map((camp) => (
                            <Tr key={camp._id}>
                              <Td fontWeight="bold">{camp.campaignId}</Td>
                              <Td>{camp.name}</Td>
                              <Td>{camp.location}</Td>
                              <Td>{camp.bloodBankId?.name || "N/A"}</Td>

                              <Td>
                                {camp.date && camp.time
                                  ? `${new Date(camp.date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )} - ${new Date(
                                      `${
                                        new Date(camp.date)
                                          .toISOString()
                                          .split("T")[0]
                                      }T${camp.time.trim()}`
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}`
                                  : "N/A"}
                              </Td>
                              <Td>{camp.estimate}</Td>
                              <Td>{flagStatusBadge(camp.flag)}</Td>

                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => openDeleteDialog(camp)}
                                  isDisabled={![0, 2].includes(camp.flag)} // allow only Pending (0) and Rejected (2)
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
                        No recent campaigns
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </Grid>
            </>
          )}

          {activeSection === "profile" && <OrganizationProfile />}
          {activeSection === "campaigns" && <CreateCampaign />}
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
              Are you sure you want to delete this Campaign? This action cannot
              be undone.
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
}
