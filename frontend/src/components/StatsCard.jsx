import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";

const colorSchemes = {
  blue: { bg: "blue.50", iconColor: "blue.500" },
  green: { bg: "green.50", iconColor: "green.500" },
  purple: { bg: "purple.50", iconColor: "purple.500" },
  orange: { bg: "orange.50", iconColor: "orange.500" },
};

export const StatsCard = ({
  icon,
  title,
  value,
  unit = "",
  trend,
  color = "blue",
}) => {
  return (
    <Card bg={colorSchemes[color].bg} borderRadius="lg" boxShadow="sm">
      <CardHeader pb={0}>
        <Flex align="center">
          <Icon
            as={icon}
            boxSize={6}
            color={colorSchemes[color].iconColor}
            mr={2}
          />
          <Text fontWeight="medium" color="gray.600">
            {title}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody pt={2}>
        <Stat>
          <StatNumber fontSize="2xl" fontWeight="bold">
            {value}
            {unit && (
              <Text as="span" fontSize="md" ml={1}>
                {unit}
              </Text>
            )}
          </StatNumber>
          {trend && (
            <StatHelpText
              color={trend.includes("+") ? "green.500" : "orange.500"}
            >
              {trend}
            </StatHelpText>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
};
