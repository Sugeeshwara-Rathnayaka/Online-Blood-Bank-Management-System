import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import api from "../../api/api";

const DonorDonations = () => {
  const [hospitalDonations, setHospitalDonations] = useState([]);
  const [campaignDonations, setCampaignDonations] = useState([]);

  const cardBg = useColorModeValue("white", "gray.800");
  //const textColor = useColorModeValue("gray.800", "white");
  const errorTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/donor/donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHospitalDonations(res.data.hospital || []);
        setCampaignDonations(res.data.campaign || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };
    fetchDonations();
  }, []);

  return (
    <Box p={4}>
      {/* Hospital Donations Table */}
      <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md" mb={10}>
        <Heading size="md" mb={4} textAlign="center">
          Hospital Donations
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="red.500">Hospital Name</Th>
              <Th color="red.500">District</Th>
              <Th color="red.500">No of Units</Th>
              <Th color="teal.500">👍</Th>
              <Th color="teal.500">👎</Th>
            </Tr>
          </Thead>
          <Tbody>
            {hospitalDonations.length > 0 ? (
              hospitalDonations.map((donation, idx) => (
                <Tr key={idx}>
                  <Td>{donation.hospitalName}</Td>
                  <Td>{donation.district}</Td>
                  <Td>{donation.units}</Td>
                  <Td>{donation.approved ? "Yes" : "No"}</Td>
                  <Td>{donation.rejected ? "Yes" : "No"}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" color={errorTextColor}>
                  Sorry. There is no hospital donations
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Campaign Donations Table */}
      <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4} textAlign="center">
          Campaign Donations
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="red.500">Campaign Name</Th>
              <Th color="red.500">Location</Th>
              <Th color="red.500">Organization</Th>
              <Th color="red.500">Telephone</Th>
              <Th color="red.500">Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaignDonations.length > 0 ? (
              campaignDonations.map((donation, idx) => (
                <Tr key={idx}>
                  <Td>{donation.name}</Td>
                  <Td>{donation.location}</Td>
                  <Td>{donation.organization}</Td>
                  <Td>{donation.phone}</Td>
                  <Td>{new Date(donation.date).toLocaleDateString()}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" color={errorTextColor}>
                  There are no campaign donations yet. See available campaigns
                  to donate!
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DonorDonations;
