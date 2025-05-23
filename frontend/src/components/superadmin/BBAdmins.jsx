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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMail, FiPhone, FiTrash2 } from "react-icons/fi";
import {
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  SearchAndActionBar,
} from "./SharedComponents";
import AddBBAdminForm from "./AddNewBBAdmin";
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

const BBAdmins = ({
  bbAdmins,
  bloodBanks,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  filteredBBAdmins,
  fetchData,
  handleDelete,
  handleAddAdmin,
}) => {
  // Color variables
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("red.600", "red.500");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("red.200", "red.800");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // AlertDialog state for delete confirmation
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const cancelRef = useRef();

  // Open delete confirmation dialog
  const openDeleteDialog = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedAdmin(null);
  };

  // Confirm delete and call the handleDelete prop
  const confirmDelete = () => {
    handleDelete(selectedAdmin._id, "Admin");
    closeDeleteDialog();
  };

  const handleAddNew = () => {
    onOpen();
  };

  const handleFilter = () => {
    console.log("Filter admins clicked");
  };

  const handleAdminSubmit = async (adminData) => {
    setIsAddingAdmin(true);
    try {
      await handleAddAdmin(adminData);
      onClose();
      fetchData();
    } catch (err) {
      console.error("Error adding admin:", err);
    } finally {
      setIsAddingAdmin(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={fetchData} />;
  }

  return (
    <Box bg={bg} color={color}>
      {/* Add Admin Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={bg}>
          <AddBBAdminForm
            onSuccess={onClose}
            bloodBanks={bloodBanks}
            onSubmit={handleAdminSubmit}
            isLoading={isAddingAdmin}
          />
        </ModalContent>
      </Modal>

      <SearchAndActionBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddNew}
        onRefresh={fetchData}
        onFilter={handleFilter}
      />

      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg" color={brandColor}>
          Blood Bank Admins
        </Heading>
        <Text color={color}>
          Showing {filteredBBAdmins.length} of {bbAdmins.length} admins
        </Text>
      </Flex>

      {bbAdmins.length === 0 ? (
        <EmptyState type="Admins" onAddNew={handleAddNew} />
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
                <Th color="white">Email</Th>
                <Th color="white">NIC</Th>
                <Th color="white">Phone</Th>
                <Th color="white">Blood Bank</Th>
                <Th color="white" textAlign="right">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBBAdmins.map((admin) => (
                <Tr
                  key={admin._id}
                  _hover={{ bg: hoverBg }}
                  _active={{ bg: activeBg }}
                >
                  <Td>
                    <Flex align="center">
                      <Avatar
                        name={`${admin.firstName} ${admin.lastName}`}
                        size="sm"
                        mr={2}
                        bg="red.300"
                      />
                      <Box>
                        <Text fontWeight="medium">
                          {admin.firstName} {admin.lastName}
                        </Text>
                        <Text fontSize="sm" color={color}>
                          {admin.bloodBankName || "N/A"}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    <IconText icon={FiMail}>{admin.email}</IconText>
                  </Td>
                  <Td>{admin.nic}</Td>
                  <Td>
                    <IconText icon={FiPhone}>{admin.phone}</IconText>
                  </Td>
                  <Td>{admin.bloodBankName || "N/A"}</Td>
                  <Td textAlign="right">
                    <IconButton
                      aria-label="Delete admin"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(admin)}
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
              Delete Admin
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete admin{" "}
              <strong>
                {selectedAdmin?.firstName} {selectedAdmin?.lastName}
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

export default BBAdmins;
