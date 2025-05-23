import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from "@chakra-ui/react";

export const DataTable = ({ columns, data, itemsPerPage = 10 }) => {
  return (
    <Box overflowX="auto">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.accessor}>{column.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.slice(0, itemsPerPage).map((row) => (
            <Tr key={row.id}>
              {columns.map((column) => (
                <Td key={`${row.id}-${column.accessor}`}>
                  <Text>{row[column.accessor]}</Text>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {data.length > itemsPerPage && (
        <Text mt={2} color="gray.500" fontSize="sm">
          Showing {itemsPerPage} of {data.length} items
        </Text>
      )}
    </Box>
  );
};
