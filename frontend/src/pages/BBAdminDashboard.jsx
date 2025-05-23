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
} from "@chakra-ui/react";
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
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

const BloodBankAdminDashboard = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  //const textColor = useColorModeValue("gray.800", "white");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const criticalColor = useColorModeValue("red.500", "red.300");
  const warningColor = useColorModeValue("orange.500", "orange.300");

  // Mock data - replace with real data from API
  const bloodBankStats = {
    name: "City Central Blood Bank",
    totalInventory: 156,
    criticalLevels: 3,
    pendingDonations: 8,
    fulfilledRequests: 24,
    bloodGroups: {
      "A+": { current: 25, threshold: 15 },
      "A-": { current: 8, threshold: 5 },
      "B+": { current: 18, threshold: 12 },
      "B-": { current: 6, threshold: 4 },
      "AB+": { current: 5, threshold: 3 },
      "AB-": { current: 2, threshold: 2 },
      "O+": { current: 32, threshold: 20 },
      "O-": { current: 10, threshold: 6 },
    },
  };

  const criticalInventory = [
    { bloodGroup: "AB+", current: 2, threshold: 3, type: "whole_blood" },
    { bloodGroup: "B-", current: 3, threshold: 4, type: "platelets" },
    { bloodGroup: "AB-", current: 1, threshold: 2, type: "whole_blood" },
  ];

  const upcomingDonations = [
    {
      id: "DON-1001",
      donor: "Rahul Sharma",
      bloodGroup: "O+",
      date: "2023-08-15",
      time: "10:00 AM",
      type: "whole_blood",
      status: "confirmed",
    },
    {
      id: "DON-1002",
      donor: "Priya Patel",
      bloodGroup: "A-",
      date: "2023-08-14",
      time: "02:30 PM",
      type: "platelets",
      status: "confirmed",
    },
    {
      id: "DON-1003",
      donor: "Amit Singh",
      bloodGroup: "B+",
      date: "2023-08-16",
      time: "11:00 AM",
      type: "whole_blood",
      status: "pending",
    },
  ];

  const pendingRequests = [
    {
      id: "REQ-BB-2041",
      hospital: "City General Hospital",
      bloodGroup: "O+",
      units: 4,
      requestedBy: "Dr. Ananya Reddy",
      dateRequested: "2023-08-10",
      priority: "high",
    },
    {
      id: "REQ-BB-2040",
      hospital: "Northside Medical Center",
      bloodGroup: "A-",
      units: 2,
      requestedBy: "Dr. Rohit Verma",
      dateRequested: "2023-08-09",
      priority: "normal",
    },
  ];

  const recentActivities = [
    {
      id: "ACT-3001",
      action: "inventory_update",
      description: "Added 2 units of B+ whole blood",
      timestamp: "2023-08-10 14:30",
      performedBy: "You",
    },
    {
      id: "ACT-3000",
      action: "request_fulfilled",
      description: "Fulfilled request REQ-BB-2039 (3 units O+)",
      timestamp: "2023-08-10 11:15",
      performedBy: "You",
    },
    {
      id: "ACT-2999",
      action: "donation_processed",
      description: "Processed donation from Amit Kumar (A+)",
      timestamp: "2023-08-09 16:45",
      performedBy: "Staff Member",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge colorScheme="green" display="flex" alignItems="center">
            <Icon as={FiCheckCircle} mr={1} />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge colorScheme="yellow" display="flex" alignItems="center">
            <Icon as={FiClock} mr={1} />
            Pending
          </Badge>
        );
      default:
        return <Badge colorScheme="gray">{status}</Badge>;
    }
  };

  const getPriorityTag = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return (
          <Tag colorScheme="red" size="sm">
            High
          </Tag>
        );
      case "normal":
        return (
          <Tag colorScheme="blue" size="sm">
            Normal
          </Tag>
        );
      default:
        return (
          <Tag colorScheme="gray" size="sm">
            {priority}
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

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
      >
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            {bloodBankStats.name} Dashboard
          </Heading>
          <Text color={secondaryText}>
            Blood bank management and monitoring
          </Text>
        </Box>
        <Flex mt={{ base: 4, md: 0 }}>
          <Button
            as={RouterLink}
            to="/donations/new"
            colorScheme="red"
            leftIcon={<Icon as={FiPlus} />}
            mr={3}
          >
            New Donation
          </Button>
          <Button
            as={RouterLink}
            to="/inventory/manage"
            leftIcon={<Icon as={FiPackage} />}
          >
            Manage Inventory
          </Button>
        </Flex>
      </Flex>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Inventory</StatLabel>
              <StatNumber>{bloodBankStats.totalInventory}</StatNumber>
              <StatHelpText>
                <Icon as={FiDroplet} mr={1} color="red.500" />
                Blood units
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Critical Levels</StatLabel>
              <StatNumber color={criticalColor}>
                {bloodBankStats.criticalLevels}
              </StatNumber>
              <StatHelpText>
                <Icon as={FiAlertTriangle} mr={1} color={criticalColor} />
                Needs attention
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Pending Donations</StatLabel>
              <StatNumber color="blue.500">
                {bloodBankStats.pendingDonations}
              </StatNumber>
              <StatHelpText>
                <Icon as={FiClock} mr={1} color="blue.500" />
                To be processed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Fulfilled Requests</StatLabel>
              <StatNumber color="green.500">
                {bloodBankStats.fulfilledRequests}
              </StatNumber>
              <StatHelpText>
                <Icon as={FiCheckCircle} mr={1} color="green.500" />
                This month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Inventory Status and Critical Alerts */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
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
            <Heading size="md">Critical Inventory Alerts</Heading>
          </CardHeader>
          <CardBody>
            {criticalInventory.length > 0 ? (
              <VStack align="stretch" spacing={3}>
                {criticalInventory.map((item, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="red.100"
                    bg="red.50"
                  >
                    <Flex justify="space-between">
                      <Text fontWeight="bold">{item.bloodGroup}</Text>
                      <Text color="red.500" fontWeight="bold">
                        {item.current}/{item.threshold}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color={secondaryText}>
                      {item.type.replace("_", " ")}
                    </Text>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      mt={2}
                      w="full"
                    >
                      Request Supply
                    </Button>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                No critical inventory alerts
              </Alert>
            )}
          </CardBody>
        </Card>
      </Grid>

      {/* Upcoming Donations and Pending Requests */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Upcoming Donations</Heading>
          </CardHeader>
          <CardBody>
            {upcomingDonations.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Donor</Th>
                    <Th>Blood Group</Th>
                    <Th>Date/Time</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {upcomingDonations.map((donation) => (
                    <Tr key={donation.id}>
                      <Td>{donation.donor}</Td>
                      <Td>{donation.bloodGroup}</Td>
                      <Td>
                        {new Date(donation.date).toLocaleDateString()} at{" "}
                        {donation.time}
                      </Td>
                      <Td>{getStatusBadge(donation.status)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                No upcoming donations scheduled
              </Alert>
            )}
          </CardBody>
          <CardFooter>
            <Button
              as={RouterLink}
              to="/donations/schedule"
              variant="ghost"
              size="sm"
            >
              View All Donations
            </Button>
          </CardFooter>
        </Card>

        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Pending Blood Requests</Heading>
          </CardHeader>
          <CardBody>
            {pendingRequests.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Hospital</Th>
                    <Th>Blood Group</Th>
                    <Th>Units</Th>
                    <Th>Priority</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingRequests.map((request) => (
                    <Tr key={request.id}>
                      <Td>{request.hospital}</Td>
                      <Td>{request.bloodGroup}</Td>
                      <Td>{request.units}</Td>
                      <Td>{getPriorityTag(request.priority)}</Td>
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
          <CardFooter>
            <Button as={RouterLink} to="/requests" variant="ghost" size="sm">
              View All Requests
            </Button>
          </CardFooter>
        </Card>
      </Grid>

      {/* Recent Activity and Quick Actions */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            {recentActivities.length > 0 ? (
              <VStack align="stretch" spacing={3}>
                {recentActivities.map((activity) => (
                  <Flex
                    key={activity.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    align="center"
                  >
                    <Box
                      p={2}
                      mr={3}
                      bg="blue.50"
                      borderRadius="full"
                      color="blue.500"
                    >
                      <Icon as={FiActivity} />
                    </Box>
                    <Box flex={1}>
                      <Text fontWeight="medium">{activity.description}</Text>
                      <Text fontSize="sm" color={secondaryText}>
                        {activity.timestamp} • {activity.performedBy}
                      </Text>
                    </Box>
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
    </Box>
  );
};

export default BloodBankAdminDashboard;
