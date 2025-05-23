import { VStack, HStack, Text, Icon, Divider, Box } from "@chakra-ui/react";

export const RecentActivity = ({ items }) => {
  return (
    <VStack align="stretch" spacing={4}>
      {items.map((item, index) => (
        <Box key={item.id}>
          <HStack spacing={3}>
            <Icon as={item.icon} boxSize={5} color="blue.500" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">{item.action}</Text>
              <Text fontSize="sm" color="gray.500">
                {item.time}
              </Text>
            </VStack>
          </HStack>
          {index < items.length - 1 && <Divider my={3} />}
        </Box>
      ))}
    </VStack>
  );
};
