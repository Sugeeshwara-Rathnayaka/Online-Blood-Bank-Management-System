import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Spinner,
  Flex,
  useColorModeValue,
  Avatar,
  Badge,
  Button,
  Stack,
  Icon,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiDroplet,
  FiMapPin,
  FiMail,
  FiPhone,
  FiRefreshCcw,
} from "react-icons/fi";
import api from "../../api/api";

const VerifiedDonorsList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [filters, setFilters] = useState({ district: "", bloodGroup: "" });
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const boxbg = useColorModeValue("gray.50", "gray.800");

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/hos/all-donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonors(res.data.donors);
      setFilteredDonors(res.data.donors);
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await api.get("/select/get-districts");
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };
  const fetchBloodTypes = async () => {
    try {
      const res = await api.get("/select/get-bloodtypes");
      setBloodTypes(res.data.bloodTypes);
    } catch (error) {
      console.error("Failed to load blood types:", error);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchDistricts();
    fetchBloodTypes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const filtered = donors.filter((donor) => {
      const matchesDistrict =
        !filters.district || donor.district?._id === filters.district;
      const matchesBloodGroup =
        !filters.bloodGroup || donor.bloodGroup === filters.bloodGroup;
      return matchesDistrict && matchesBloodGroup;
    });
    setFilteredDonors(filtered);
  }, [filters, donors]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  return (
    <Box mt={10} px={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
        <Heading size="lg" color="red.600">
          Available Verified Donors
        </Heading>

        <Flex gap={4} wrap="wrap">
          <Select
            placeholder="Filter by Blood Group"
            name="bloodGroup"
            value={filters.bloodGroup}
            onChange={handleFilterChange}
            // w={{ base: "100%", md: "200px" }}
            w="200px"
            bg="white"
            color="gray.800"
            borderColor="red.300"
            focusBorderColor="red.500"
            borderRadius="md"
            fontWeight="medium"
          >
            {bloodTypes.map((type) => (
              <option key={type._id || type} value={type.type || type}>
                {type.type || type}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Filter by District"
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
            // w={{ base: "100%", md: "200px" }}
            w="200px"
            bg="white"
            color="gray.800"
            borderColor="red.300"
            focusBorderColor="red.500"
            borderRadius="md"
            fontWeight="medium"
          >
            {districts.map((dist) => (
              <option key={dist._id} value={dist._id}>
                {dist.name}
              </option>
            ))}
          </Select>
          <Tooltip label="Refresh data">
            <Button
              mt={0.1}
              h="38px"
              leftIcon={<FiRefreshCcw />}
              variant="outline"
              colorScheme="red"
              size="sm"
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                fetchDonors();
              }}
            >
              <Text>Refresh</Text>
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      {filteredDonors.length === 0 ? (
        <Box textAlign="center" p={8} bg={boxbg} borderRadius="md">
          <Icon as={FiUsers} boxSize={8} color="gray.400" mb={3} />
          <Text fontSize="lg" color="gray.500">
            No verified donors found for selected filters
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
          {filteredDonors.map((donor) => (
            <Card
              key={donor._id}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
            >
              <CardHeader>
                <Flex align="center" gap={4}>
                  <Avatar
                    name={`${donor.firstName} ${donor.lastName}`}
                    bg="red.500"
                    size="md"
                  />
                  <Box>
                    <Heading size="sm" color="black">
                      {donor.firstName} {donor.lastName}
                    </Heading>
                    <Badge
                      colorScheme="green"
                      mt={1}
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      Verified
                    </Badge>
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={3}>
                  <Flex align="center">
                    <Icon as={FiDroplet} color="red.500" mr={2} />
                    <Text>
                      <strong>Blood Group:</strong> {donor.bloodGroup}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiMapPin} color="red.500" mr={2} />
                    <Text>
                      <strong>Location:</strong> {donor.district?.name || "N/A"}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiMail} color="red.500" mr={2} />
                    <Text isTruncated>
                      <strong>Email:</strong> {donor.email}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiPhone} color="red.500" mr={2} />
                    <Text>
                      <strong>Phone:</strong> {donor.phone}
                    </Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default VerifiedDonorsList;
