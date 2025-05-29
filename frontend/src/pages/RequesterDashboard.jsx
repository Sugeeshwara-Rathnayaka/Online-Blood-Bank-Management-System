import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Spinner,
  Flex,
  useColorModeValue,
  Button,
  Icon,
  VStack,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useMediaQuery,
  Stack,
} from "@chakra-ui/react";
import {
  FiDroplet,
  FiAward,
  FiUser,
  FiGrid,
  FiHome,
  FiUsers,
} from "react-icons/fi";
import api from "../api/api";
import CashDonate from "./CashDonation";
import RequesterProfile from "../components/requester/RequesterProfile";
import LiveClock from "../components/other/LiveClock";
import VerifiedDonorsList from "../components/requester/VerifiedDonorsList";

// -------------------- Sidebar Component --------------------
const SidebarContent = ({ onClose, setActiveSection, activeSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.600">
      Requester Dashboard
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiAward, label: "Donate Us", section: "donate" },
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
const RequesterDashboard = () => {
  // -------------------- State --------------------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // -------------------- Hooks --------------------

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
  const { firstName = "" } = user;

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
                    direction={{ base: "column", md: "column" }}
                    justify="space-between"
                    align="center"
                  >
                    <Box>
                      <Heading size="md" mb={2}>
                        Welcome back, {firstName}!
                      </Heading>
                      <Text color={secondaryText}>
                        Quickly find donors by blood type, location and contact
                        them. Your actions save lives!
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              <LiveClock />
              {/* Donor list display */}
              <VerifiedDonorsList />
            </>
          )}
          {/* Other Sections */}
          {activeSection === "donate" && <CashDonate />}
          {activeSection === "profile" && <RequesterProfile />}
        </Box>
      </Flex>
    </>
  );
};

export default RequesterDashboard;
