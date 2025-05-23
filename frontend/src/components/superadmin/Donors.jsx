import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { FiPhone, FiTrash2, FiUser } from "react-icons/fi";
import { FaMale, FaFemale, FaTransgender } from "react-icons/fa";
import {
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  SearchAndActionBar,
  ValidationBadge,
} from "./SharedComponents";
import { useRef } from "react";

const IconText = ({ icon, children }) => {
  const Icon = icon;
  return (
    <Flex align="center">
      <Icon />
      <Text ml={2}>{children}</Text>
    </Flex>
  );
};

const Donors = ({
  donors,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  filteredDonors,
  fetchData,
  handleDelete,
}) => {
  // Color variables
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("red.600", "red.500");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("red.200", "red.800");

  // AlertDialog state for delete confirmation
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const cancelRef = useRef();

  // Open delete confirmation dialog
  const openDeleteDialog = (donor) => {
    setSelectedDonor(donor);
    setIsDeleteOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedDonor(null);
  };

  // Confirm delete and call the handleDelete prop
  const confirmDelete = () => {
    handleDelete(selectedDonor._id, "Donor");
    closeDeleteDialog();
  };

  const handleFilter = () => {
    console.log("Filter donors clicked");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={fetchData} />;
  }

  return (
    <Box bg={bg} color={color}>
      <SearchAndActionBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={fetchData}
        onFilter={handleFilter}
        onAddNew={null}
      />

      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg" color={brandColor}>
          Blood Bank Donors
        </Heading>
        <Text color={color}>
          Showing {filteredDonors.length} of {donors.length} donors
        </Text>
      </Flex>

      {donors.length === 0 ? (
        <EmptyState type="Donors" />
      ) : (
        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
        >
          <Table variant="striped">
            <Thead bg={brandColor}>
              <Tr>
                <Th color="white">Name</Th>
                <Th color="white">Age</Th>
                <Th color="white">NIC</Th>
                <Th color="white">Phone</Th>
                <Th color="white">Gender</Th>
                <Th color="white">District</Th>
                <Th color="white">Blood Group</Th>
                <Th color="white">Address</Th>
                <Th color="white" textAlign="center">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDonors.map((donor) => (
                <Tr
                  key={donor._id}
                  _hover={{ bg: hoverBg }}
                  _active={{ bg: activeBg }}
                >
                  <Td>
                    <Flex align="center">
                      <Avatar
                        name={`${donor.firstName} ${donor.lastName}`}
                        size="sm"
                        mr={2}
                        bg="red.300"
                      />
                      <Box>
                        <Text fontWeight="medium">
                          {donor.firstName} {donor.lastName}
                        </Text>
                        <Text fontSize="sm" color={color}>
                          {donor.email || "N/A"}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    <IconText icon={FiUser}>{donor.age}</IconText>
                  </Td>
                  <Td>{donor.nic}</Td>
                  <Td>
                    <IconText icon={FiPhone}>{donor.phone}</IconText>
                  </Td>
                  <Td>
                    {donor.gender && (
                      <Flex align="center">
                        {donor.gender === "Male" && <FaMale color="blue" />}
                        {donor.gender === "Female" && <FaFemale color="pink" />}
                        {donor.gender === "Other" && (
                          <FaTransgender color="purple" />
                        )}
                        <Text ml={2}>{donor.gender}</Text>
                      </Flex>
                    )}
                  </Td>
                  <Td>{donor.district || "N/A"}</Td>
                  <Td textAlign="center">{donor.bloodGroup}</Td>
                  <Td>{donor.address || "N/A"}</Td>
                  <Td textAlign="center">
                    <Tooltip
                      label={
                        donor.validation === 0
                          ? "Mark as Rejected"
                          : "Mark as Verified"
                      }
                      hasArrow
                      placement="top"
                    >
                      <Box as="span">
                        <ValidationBadge
                          validation={donor.validation}
                          id={donor._id}
                          fetchData={fetchData}
                        />
                      </Box>
                    </Tooltip>

                    <IconButton
                      aria-label="Delete donor"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(donor)}
                      ml={2}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bg}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Donor
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete donor{" "}
              <strong>
                {selectedDonor?.firstName} {selectedDonor?.lastName}
              </strong>
              ? This action cannot be undone.
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
    </Box>
  );
};

export default Donors;
