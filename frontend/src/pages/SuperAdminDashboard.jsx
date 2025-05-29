import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Spinner,
  useToast,
  useMediaQuery,
  VStack,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Tag,
} from "@chakra-ui/react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiHome,
  FiMapPin,
  FiMenu,
  FiGrid,
  FiUsers,
} from "react-icons/fi";
import api from "../api/api";
import BloodBanks from "../components/superadmin/BloodBanks";
import BBAdmins from "../components/superadmin/BBAdmins";
import Donors from "../components/superadmin/Donors";

const SidebarContent = ({ onClose, activeSection, setActiveSection }) => (
  <VStack align="stretch" spacing={4} p={4}>
    <Heading size="md" mb={4} color="red.700">
      Super Admin
    </Heading>
    <Divider />
    {[
      { icon: FiGrid, label: "Overview", section: "overview" },
      { icon: FiHome, label: "Blood Banks", section: "hospitals" },
      { icon: FiUsers, label: "Admins", section: "admins" },
      { icon: FiUsers, label: "Blood Donors", section: "donors" },
      // { icon: FiUser, label: "Profile", section: "profile" },
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

const renderStatsCard = (title, value, icon, color) => (
  <Card bg={`${color}.100`} borderRadius="lg">
    <CardHeader pb={0}>
      <Flex justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="semibold" color={`${color}.800`}>
          {title}
        </Text>
        <Box as={icon} size="20px" color={`${color}.500`} />
      </Flex>
    </CardHeader>
    <CardBody py={2}>
      <Heading size="lg" color={`${color}.800`}>
        {value}
      </Heading>
    </CardBody>
    <CardFooter pt={0}>
      <Text fontSize="xs" color={`${color}.600`}>
        Last updated: Just now
      </Text>
    </CardFooter>
  </Card>
);

const SuperAdminDashboard = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [bbAdmins, setBbAdmins] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSection, setActiveSection] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");
  const toast = useToast();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bbHospitalsResponse, bbAdminsResponse, donorsResponse] =
        await Promise.all([
          api.get("/superadmin/get-bbhos"),
          api.get("/superadmin/all-bbadmin"),
          api.get("/superadmin/all-donor"),
        ]);

      if (bbHospitalsResponse.data.success) {
        setBloodBanks(bbHospitalsResponse.data.bBHospitals);
      }

      if (bbAdminsResponse.data.success) {
        setBbAdmins(bbAdminsResponse.data.bBAdmins);
      }
      if (donorsResponse.data.success) {
        setDonors(donorsResponse.data.donors);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
    // Implement edit functionality
  };

  const handleDelete = async (id, type) => {
    try {
      let endpoint = "";
      switch (type) {
        case "Bank":
          endpoint = `/superadmin/hardDelete-bbhos/${id}`;
          break;
        case "Admin":
          endpoint = `/superadmin/delete-bbadmin/${id}`;
          break;
        case "Donor":
          endpoint = `/superadmin/delete-donor/${id}`;
          break;
        // Add other types as needed
        default:
          throw new Error("Invalid delete type");
      }

      await api.delete(endpoint);

      toast({
        title: "Success",
        description: `${type} deleted successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      const message =
        error.response?.data?.message || error.message || "Failed to delete.";

      toast({
        title: "Error",
        description: `Failed to delete ${type}: ${message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredBloodBanks = bloodBanks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBBAdmins = bbAdmins.filter(
    (admin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDonors = donors.filter((donor) => {
    const firstName = donor.firstName || "";
    const lastName = donor.lastName || "";
    const email = donor.email || "";

    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading && !bloodBanks.length && !bbAdmins.length && !donors.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="red.500" />
      </Box>
    );
  }

  return (
    <Flex minH="100vh">
      {/* Sidebar - Desktop */}
      {isLargerThanMD && (
        <Box
          w="250px"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          boxShadow="sm"
          position="sticky"
          top="0"
          h="100vh"
        >
          <SidebarContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Super Admin</DrawerHeader>
          <DrawerBody>
            <SidebarContent
              onClose={() => setIsDrawerOpen(false)}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1} p={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center" mb={6}>
          {!isLargerThanMD && (
            <IconButton
              icon={<FiMenu />}
              onClick={() => setIsDrawerOpen(true)}
              variant="outline"
              aria-label="Open menu"
              mr={4}
            />
          )}
          <Heading
            as="h1"
            size="xl"
            color="red.700"
            display="flex"
            alignItems="center"
            gap={2}
          >
            {activeSection === "overview" && <FiGrid />}
            {activeSection === "hospitals" && <FiHome />}
            {activeSection === "admins" && <FiUsers />}
            {activeSection === "donors" && <FiUsers />}
            {activeSection === "overview" && "Overview"}
            {activeSection === "hospitals" && "Blood Bank Hospitals"}
            {activeSection === "admins" && "Blood Bank Admins"}
            {activeSection === "donors" && "Blood Donor"}
          </Heading>
        </Flex>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {renderStatsCard(
                "Total Hospitals",
                bloodBanks.length,
                FiHome,
                "red"
              )}
              {renderStatsCard(
                "Active Hospitals",
                bloodBanks.filter((b) => !b.isDeleted).length,
                FiMapPin,
                "green"
              )}
              {renderStatsCard("Total Admins", bbAdmins.length, FiUser, "red")}
              {renderStatsCard(
                "Active Admins",
                bbAdmins.filter((a) => !a.isDeleted).length,
                FiUser,
                "green"
              )}
              {renderStatsCard("Total Donors", donors.length, FiHome, "red")}
              {renderStatsCard(
                "Verified Donors",
                donors.filter((c) => c.validation === 0).length,
                FiMapPin,
                "green"
              )}
            </SimpleGrid>
          </>
        )}

        {/* Blood Bank Hospitals Section */}
        {activeSection === "hospitals" && (
          <BloodBanks
            bloodBanks={bloodBanks}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBloodBanks={filteredBloodBanks}
            fetchData={fetchData}
            handleViewDetails={handleViewDetails}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* Blood Bank Admins Section */}
        {activeSection === "admins" && (
          <BBAdmins
            bbAdmins={bbAdmins}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBBAdmins={filteredBBAdmins}
            fetchData={fetchData}
            handleViewDetails={handleViewDetails}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* Blood Donors Section */}
        {activeSection === "donors" && (
          <Donors
            donors={donors}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredDonors={filteredDonors}
            fetchData={fetchData}
            handleViewDetails={handleViewDetails}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* Detail View Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedItem?.name ||
                `${selectedItem?.firstName} ${selectedItem?.lastName}`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedItem && (
                <Stack spacing={4}>
                  {selectedItem.name && (
                    <>
                      <Flex align="center">
                        <FiHome />
                        <Text ml={2} fontWeight="medium">
                          {selectedItem.name}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <FiMapPin />
                        <Text ml={2}>
                          {selectedItem.address}, {selectedItem.district}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Text fontWeight="medium" mr={2}>
                          Capacity:
                        </Text>
                        <Tag
                          colorScheme={
                            selectedItem.capacity > 200
                              ? "green"
                              : selectedItem.capacity > 100
                              ? "orange"
                              : "red"
                          }
                        >
                          {selectedItem.capacity}
                        </Tag>
                      </Flex>
                    </>
                  )}
                  {selectedItem.email && (
                    <>
                      <Flex align="center">
                        <FiUser />
                        <Text ml={2}>
                          {selectedItem.firstName} {selectedItem.lastName}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <FiMail />
                        <Text ml={2}>{selectedItem.email}</Text>
                      </Flex>
                      <Flex align="center">
                        <FiPhone />
                        <Text ml={2}>{selectedItem.phone}</Text>
                      </Flex>
                      <Flex align="center">
                        <Text fontWeight="medium" mr={2}>
                          NIC:
                        </Text>
                        <Text>{selectedItem.nic}</Text>
                      </Flex>
                    </>
                  )}
                  <Flex align="center">
                    <Text fontWeight="medium" mr={2}>
                      Status:
                    </Text>
                    <Badge
                      colorScheme={selectedItem.isDeleted ? "red" : "green"}
                    >
                      {selectedItem.isDeleted ? "Inactive" : "Active"}
                    </Badge>
                  </Flex>
                </Stack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={() => handleEdit(selectedItem)}>
                Edit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default SuperAdminDashboard;
