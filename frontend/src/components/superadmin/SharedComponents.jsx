import {
  Badge,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Box,
  Spinner,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiPlus,
} from "react-icons/fi";
import api from "../../api/api";

export const ValidationBadge = ({ validation, id, fetchData }) => {
  const toast = useToast();

  const handleToggleValidation = async () => {
    const newStatus = validation === 0 ? 1 : 0; // toggle between verified and rejected

    try {
      const { data } = await api.put(
        `/superadmin/update-donor/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast({
        title: "Validation Updated",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchData(); // refresh data
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update validation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Badge
      colorScheme={validation === 0 ? "green" : "red"}
      cursor="pointer"
      onClick={handleToggleValidation}
      _hover={{ opacity: 0.8 }}
    >
      {validation === 0 ? "Verified" : "Rejected"}
    </Badge>
  );
};

export const StatusBadge = ({ isDeleted, id, fetchData }) => {
  const toast = useToast();

  const handleToggleStatus = async () => {
    try {
      const url = isDeleted
        ? `/superadmin/restore-bbhos/${id}`
        : `/superadmin/delete-bbhos/${id}`;

      const { data } = await api.put(url, {}, { withCredentials: true });
      toast({
        title: "Status Updated",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the data after the update
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Badge
      colorScheme={isDeleted ? "red" : "green"}
      cursor="pointer"
      onClick={handleToggleStatus}
      _hover={{ opacity: 0.8 }}
    >
      {isDeleted ? "Inactive" : "Active"}
    </Badge>
  );
};

export const LoadingSpinner = () => (
  <Flex justify="center" py={10}>
    <Spinner size="xl" color="red.500" />
  </Flex>
);

export const ErrorAlert = ({ error, onRetry }) => (
  <Alert status="error" borderRadius="md" my={4}>
    <AlertIcon />
    <AlertTitle mr={2}>Error loading data!</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
    <Button
      colorScheme="red"
      variant="ghost"
      size="sm"
      ml="auto"
      rightIcon={<FiRefreshCw />}
      onClick={onRetry}
    >
      Retry
    </Button>
  </Alert>
);

export const EmptyState = ({ type, onAddNew }) => (
  <Box textAlign="center" py={10}>
    <Text fontSize="lg" color="gray.500">
      No {type} found
    </Text>
    {onAddNew && (
      <Button colorScheme="red" mt={4} leftIcon={<FiPlus />} onClick={onAddNew}>
        Add New {type}
      </Button>
    )}
  </Box>
);

// eslint-disable-next-line react-refresh/only-export-components
export const renderTableRowActions = ({
  onView,
  onEdit,
  onDelete,
  item,
  type,
}) => (
  <Td textAlign="right">
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Actions"
        icon={<FiEye />}
        variant="ghost"
        size="sm"
        colorScheme="red"
      />
      <MenuList>
        <MenuItem icon={<FiEye />} onClick={() => onView(item)}>
          View Details
        </MenuItem>
        <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(item)}>
          Edit
        </MenuItem>
        <MenuItem
          icon={<FiTrash2 />}
          color="red.500"
          onClick={() => onDelete(item._id, type)}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  </Td>
);

export const SearchAndActionBar = ({
  searchTerm,
  setSearchTerm,
  onAddNew,
  onRefresh,
  onFilter,
}) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    justify="space-between"
    mb={6}
    gap={4}
  >
    <InputGroup maxW="400px">
      <InputLeftElement pointerEvents="none">
        <FiSearch color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        focusBorderColor="red.500"
      />
    </InputGroup>
    <Stack direction="row" spacing={4}>
      <Button leftIcon={<FiFilter />} variant="outline" onClick={onFilter}>
        Filter
      </Button>
      {onAddNew && (
        <Button leftIcon={<FiPlus />} colorScheme="red" onClick={onAddNew}>
          Add New
        </Button>
      )}
      <Tooltip label="Refresh data">
        <IconButton
          icon={<FiRefreshCw />}
          onClick={onRefresh}
          aria-label="Refresh data"
          colorScheme="red"
          variant="outline"
        />
      </Tooltip>
    </Stack>
  </Flex>
);
