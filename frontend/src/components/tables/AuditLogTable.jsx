import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiUser,
  FiDatabase,
  FiSettings,
  FiAlertTriangle,
} from "react-icons/fi";

const getActionIcon = (actionType) => {
  switch (actionType) {
    case "user":
      return FiUser;
    case "system":
      return FiSettings;
    case "database":
      return FiDatabase;
    case "security":
      return FiAlertTriangle;
    default:
      return FiUser;
  }
};

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "success":
      return <Badge colorScheme="green">Success</Badge>;
    case "failed":
      return <Badge colorScheme="red">Failed</Badge>;
    case "pending":
      return <Badge colorScheme="yellow">Pending</Badge>;
    default:
      return <Badge colorScheme="gray">{status}</Badge>;
  }
};

const AuditLogTable = ({ data, onRowClick, isLoading }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Sample data structure
  const sampleData = [
    {
      id: "AUDIT-1001",
      action: "User login",
      type: "user",
      user: "admin@system.com",
      timestamp: "2023-08-12 09:45:23",
      status: "success",
    },
    {
      id: "AUDIT-1002",
      action: "System configuration update",
      type: "system",
      user: "superadmin@system.com",
      timestamp: "2023-08-12 08:30:15",
      status: "success",
    },
    {
      id: "AUDIT-1003",
      action: "Database backup",
      type: "database",
      user: "system@automation",
      timestamp: "2023-08-12 02:30:45",
      status: "failed",
    },
  ];

  const tableData = data || sampleData;

  return (
    <Table variant="simple" size="md">
      <Thead>
        <Tr>
          <Th>Action</Th>
          <Th>User</Th>
          <Th>Timestamp</Th>
          <Th>Status</Th>
          <Th textAlign="right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            <Td colSpan={5} textAlign="center" py={8}>
              <Spinner size="lg" />
            </Td>
          </Tr>
        ) : (
          tableData.map((log) => (
            <Tr
              key={log.id}
              _hover={{ bg: hoverBg }}
              cursor={onRowClick ? "pointer" : "default"}
              onClick={() => onRowClick && onRowClick(log)}
            >
              <Td>
                <Flex align="center">
                  <Icon
                    as={getActionIcon(log.type)}
                    mr={2}
                    color={useColorModeValue("purple.500", "purple.300")}
                  />
                  <Text fontWeight="medium">{log.action}</Text>
                </Flex>
              </Td>
              <Td>
                <Text color={textColor}>{log.user}</Text>
              </Td>
              <Td>
                <Text color={textColor}>{log.timestamp}</Text>
              </Td>
              <Td>{getStatusBadge(log.status)}</Td>
              <Td textAlign="right">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <MenuList>
                    <MenuItem>View Details</MenuItem>
                    <MenuItem>Export</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

AuditLogTable.defaultProps = {
  onRowClick: null,
  isLoading: false,
};

export default AuditLogTable;
