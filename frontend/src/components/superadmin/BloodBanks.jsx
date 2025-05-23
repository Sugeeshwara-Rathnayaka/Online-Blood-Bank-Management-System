import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
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
  Tag,
  TagLabel,
  useColorModeValue,
  Tooltip,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FiEye, FiMapPin, FiTrash2 } from "react-icons/fi";
import {
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  StatusBadge,
  SearchAndActionBar,
} from "./SharedComponents";
import AddBloodBankForm from "./AddNewBBH";
import { useRef, useState } from "react";

const BloodBanks = ({
  bloodBanks,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  filteredBloodBanks,
  fetchData,
  handleViewDetails,
  handleDelete,
}) => {
  // Color variables with dark mode support
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("red.600", "red.500");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("red.200", "red.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // AlertDialog state for delete confirmation
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const cancelRef = useRef();
  const [isDeleting, setIsDeleting] = useState(false);

  // Open delete confirmation dialog
  const openDeleteDialog = (bank) => {
    setSelectedBank(bank);
    setIsDeleteOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedBank(null);
  };

  // Confirm delete and call the handleDelete prop
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDelete(selectedBank._id, "Bank");
      closeDeleteDialog();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNew = () => {
    onOpen();
  };

  const handleFilter = () => {
    console.log("Filter blood banks clicked");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} onRetry={fetchData} />;
  if (!bloodBanks || bloodBanks.length === 0)
    return <EmptyState type="Blood Banks" onAddNew={handleAddNew} />;

  return (
    <Box bg={bg} color={color}>
      <SearchAndActionBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddNew}
        onRefresh={fetchData}
        onFilter={handleFilter}
      />

      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg" color={brandColor}>
          Blood Bank Hospitals
        </Heading>
        <Text color={mutedText}>
          Showing {filteredBloodBanks.length} of {bloodBanks.length} hospitals
        </Text>
      </Flex>

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
              <Th color="white">Address</Th>
              <Th color="white">District</Th>
              <Th color="white">Phone</Th>
              <Th color="white">Capacity</Th>
              <Th color="white">Status</Th>
              <Th color="white" textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredBloodBanks.map((bank) => (
              <Tr
                key={bank._id}
                _hover={{ bg: hoverBg }}
                _active={{ bg: activeBg }}
              >
                <Td>
                  <Flex align="center">
                    <Avatar name={bank.name} size="sm" mr={2} bg="red.300" />
                    <Box>
                      <Text fontWeight="medium">{bank.name}</Text>
                      {bank.email && (
                        <Text fontSize="sm" color={mutedText}>
                          {bank.email}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Flex align="center">
                    <FiMapPin />
                    <Text ml={2}>{bank.address}</Text>
                  </Flex>
                </Td>
                <Td>{bank.district}</Td>
                <Td>
                  <Text>{bank.phone}</Text>
                </Td>
                <Td>
                  <Tag
                    size="lg"
                    colorScheme={
                      bank.capacity > 200
                        ? "green"
                        : bank.capacity > 100
                        ? "orange"
                        : "red"
                    }
                    borderRadius="full"
                  >
                    <TagLabel>{bank.capacity}</TagLabel>
                  </Tag>
                </Td>
                <Td>
                  <Tooltip
                    label={
                      bank.isDeleted
                        ? "Make this Blood Bank Active"
                        : "Make this Blood Bank Inactive"
                    }
                    hasArrow
                    placement="top"
                  >
                    <span>
                      {" "}
                      {/* Tooltip needs a DOM element wrapper */}
                      <StatusBadge
                        isDeleted={bank.isDeleted}
                        id={bank._id}
                        fetchData={fetchData}
                      />
                    </span>
                  </Tooltip>
                </Td>
                <Td textAlign="right">
                  <IconButton
                    aria-label="View Hospital"
                    icon={<FiEye />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(bank)}
                  />
                  <IconButton
                    aria-label="Delete Hospital"
                    icon={<FiTrash2 />}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(bank)}
                    ml={2}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Add New Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg={bg}>
          <AddBloodBankForm
            onSuccess={() => {
              onClose();
              fetchData();
            }}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bg}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Blood Bank
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete{" "}
              <strong>{selectedBank?.name}</strong>? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default BloodBanks;
