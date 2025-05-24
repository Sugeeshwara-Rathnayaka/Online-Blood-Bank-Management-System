import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Center,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import api from "../../api/api";

const CampaignReservationsTable = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/bbadmin/campaign-reservations");
        setReservations(res.data.reservations || []);
      } catch (err) {
        console.error("Error fetching campaign reservations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusUpdate = async (id, newFlag) => {
    try {
      await api.put(`/bbadmin/update-campaign-res-status/${id}`, {
        flag: newFlag,
      });
      toast({
        title: "Status updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const res = await api.get("/bbadmin/campaign-reservations");
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: "Could not update reservation status.",
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

  const flagStatusBadge = (status, reservationId) => {
    const config = STATUS_CONFIG[status] || {
      label: "Unknown",
      icon: FiAlertCircle,
      color: "gray",
    };

    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Badge
            colorScheme={config.color}
            display="flex"
            alignItems="center"
            px={2}
            py={1}
            borderRadius="md"
            cursor="pointer"
          >
            <Icon as={config.icon} mr={1} />
            {config.label}
          </Badge>
        </PopoverTrigger>
        <PopoverContent width="fit-content">
          <PopoverArrow />
          <PopoverBody>
            <Button
              size="xs"
              colorScheme="yellow"
              mr={2}
              isDisabled={status === 0}
              onClick={() => handleStatusUpdate(reservationId, 0)}
            >
              Pending
            </Button>
            <Button
              size="xs"
              colorScheme="green"
              mr={2}
              isDisabled={status === 1}
              onClick={() => handleStatusUpdate(reservationId, 1)}
            >
              Approve
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              isDisabled={status === 2}
              onClick={() => handleStatusUpdate(reservationId, 2)}
            >
              Reject
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Card p={4} borderRadius="lg" boxShadow="md">
      <CardHeader>
        <Center>
          <Heading size="md" color="purple.600">
            Campaign Donor Reservations
          </Heading>
        </Center>
      </CardHeader>

      <CardBody>
        {isLoading ? (
          <Center py={10}>
            <Spinner size="lg" color="purple.500" />
          </Center>
        ) : reservations.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontStyle="italic">
            No campaign reservations found.
          </Text>
        ) : (
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Campaign ID</Th>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservations.map((item) => (
                <Tr key={item._id}>
                  <Td fontWeight="semibold">{item.campaignId}</Td>
                  <Td>{item.donorNic}</Td>
                  <Td>{new Date(item.date).toLocaleDateString("en-GB")}</Td>
                  <Td>{item.time}</Td>
                  <Td>{flagStatusBadge(item.flag, item._id)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default CampaignReservationsTable;
