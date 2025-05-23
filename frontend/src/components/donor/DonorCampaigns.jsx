import {
  Box,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  Flex,
  Stack,
  Badge,
  Icon,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMapPin, FiClock, FiCalendar, FiHome, FiHeart } from "react-icons/fi";
import api from "../../api/api";

const DonorCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "red.400");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/donor/allcampaign");
        setCampaigns(res.data.campaigns || []);
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Stack align="center">
          <Spinner size="xl" color="red.500" />
          <Text mt={2}>Loading Campaigns...</Text>
        </Stack>
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color={headingColor} textAlign="center">
        🩸 Upcoming Blood Donation Campaigns
      </Heading>

      {campaigns.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No active campaigns available right now.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {campaigns.map((campaign) => (
            <Card
              key={campaign._id}
              bg={cardBg}
              shadow="lg"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)", shadow: "xl" }}
            >
              <CardHeader pb={0}>
                <Heading size="md" color={headingColor}>
                  {campaign.name}
                </Heading>

                <Divider my={2} borderColor="red.500" />

                <Text fontSize="sm" color={labelColor}>
                  Organized by:{" "}
                  <Badge colorScheme="purple" ml={1}>
                    {campaign.organizationId?.organizationName || "N/A"}
                  </Badge>
                </Text>
              </CardHeader>

              <CardBody>
                <Stack spacing={3} fontSize="sm">
                  <Flex align="center">
                    <Icon as={FiMapPin} color="red.400" boxSize={5} mr={2} />
                    <Text color={textColor}>
                      <strong>Venue:</strong> {campaign.location}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Icon as={FiHome} color="blue.400" boxSize={5} mr={2} />
                    <Text>
                      <strong>Blood Bank:</strong>{" "}
                      <Badge colorScheme="red" ml={1}>
                        {campaign.bloodBankId?.name || "N/A"}
                      </Badge>
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Icon
                      as={FiCalendar}
                      color="green.400"
                      boxSize={5}
                      mr={2}
                    />
                    <Text color={textColor}>
                      <strong>Date:</strong>{" "}
                      {new Date(campaign.date).toLocaleDateString()}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Icon as={FiClock} color="orange.400" boxSize={5} mr={2} />
                    <Text color={textColor}>
                      <strong>Starts at:</strong>{" "}
                      {new Date(
                        `1970-01-01T${campaign.time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
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

export default DonorCampaigns;
