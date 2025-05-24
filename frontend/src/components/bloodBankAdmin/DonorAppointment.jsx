import { useEffect, useState } from "react";
import {
  Box,
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

const DonorAppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/bbadmin/getAll-res");
        setAppointments(res.data.reservations || []);
      } catch (err) {
        console.error("Error fetching appointments", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, newFlag) => {
    try {
      await api.put(`/bbadmin/update-res-status/${id}`, {
        flag: newFlag,
      });
      toast({
        title: "Status updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // Refresh list
      const res = await api.get("/bbadmin/getAll-res");
      setAppointments(res.data.reservations || []);
    } catch (err) {
      console.log(err);
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
            Donor Appointment Reservations
          </Heading>
        </Center>
      </CardHeader>

      <CardBody>
        {isLoading ? (
          <Center py={10}>
            <Spinner size="lg" color="purple.500" />
          </Center>
        ) : appointments.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontStyle="italic">
            No appointments found.
          </Text>
        ) : (
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Reservation ID</Th>
                <Th>Donor NIC</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((item) => (
                <Tr key={item._id}>
                  <Td fontWeight="semibold">{item.reservationId}</Td>
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

export default DonorAppointmentsTable;
