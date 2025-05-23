import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  Avatar,
  Stack,
  Divider,
  SimpleGrid,
  Image,
  Badge,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiArrowLeft,
  FiDroplet,
  FiHeart,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

const AboutUs = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const accentColor = "red.500";

  // Team members data
  const teamMembers = [
    {
      name: "Dr. Sanjeewa Perera",
      role: "Medical Director",
      bio: "Hematology specialist with 15 years experience in blood bank management.",
      avatar: "",
    },
    {
      name: "Nimali Fernando",
      role: "Donor Coordinator",
      bio: "Organized over 200 blood drives serving 50,000+ donors.",
      avatar: "",
    },
    {
      name: "Kamal Silva",
      role: "Tech Lead",
      bio: "Built digital health platforms serving 1M+ users across Sri Lanka.",
      avatar: "",
    },
  ];

  // Milestones data
  const milestones = [
    { year: "2015", event: "Founded in Colombo" },
    { year: "2017", event: "10,000th donation" },
    { year: "2019", event: "National Blood Partner Award" },
    { year: "2022", event: "100+ hospital partnerships" },
    { year: "2023", event: "50,000 lives saved" },
  ];

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* <Button
        as={RouterLink}
        to="/"
        leftIcon={<FiArrowLeft />}
        variant="outline"
        mb={6}
      >
        Back to Home
      </Button> */}

      {/* Hero Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        mb={12}
        bg={useColorModeValue("red.50", "red.900")}
        p={8}
        borderRadius="lg"
      >
        <Box flex={1} pr={{ md: 8 }}>
          <Badge colorScheme="red" mb={4} px={3} py={1} borderRadius="full">
            About BloodLink
          </Badge>
          <Heading as="h1" size="2xl" mb={4} lineHeight="1.2">
            Saving Lives Through Donations
          </Heading>
          <Text fontSize="xl" color={secondaryText} mb={6}>
            We connect donors with those in need, ensuring safe and timely blood
            transfusions across Sri Lanka.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="red"
            size="lg"
            leftIcon={<FiDroplet />}
          >
            Become a Donor
          </Button>
        </Box>
        <Box flex={1} mt={{ base: 8, md: 0 }}>
          <Image
            src="/about-hero.jpg" // Replace with your image
            alt="Team donating blood"
            borderRadius="lg"
            boxShadow="lg"
          />
        </Box>
      </Flex>

      {/* Mission Section */}
      <Card bg={cardBg} mb={12}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box>
              <Flex align="center" mb={4}>
                <Avatar
                  icon={<FiHeart />}
                  bg={accentColor}
                  color="white"
                  mr={3}
                />
                <Heading size="md">Our Mission</Heading>
              </Flex>
              <Text>
                To ensure no patient dies waiting for blood by creating an
                efficient, transparent donation ecosystem.
              </Text>
            </Box>
            <Box>
              <Flex align="center" mb={4}>
                <Avatar
                  icon={<FiDroplet />}
                  bg={accentColor}
                  color="white"
                  mr={3}
                />
                <Heading size="md">Our Vision</Heading>
              </Flex>
              <Text>
                A Sri Lanka where safe blood is always available for every
                patient in need.
              </Text>
            </Box>
            <Box>
              <Flex align="center" mb={4}>
                <Avatar
                  icon={<FiUsers />}
                  bg={accentColor}
                  color="white"
                  mr={3}
                />
                <Heading size="md">Our Values</Heading>
              </Flex>
              <List spacing={2}>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color={accentColor} />
                  Compassion
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color={accentColor} />
                  Transparency
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color={accentColor} />
                  Innovation
                </ListItem>
              </List>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Impact Section */}
      <Card bg={cardBg} mb={12}>
        <CardHeader>
          <Heading size="lg">Our Impact</Heading>
          <Text color={secondaryText} mt={2}>
            Together we've made a difference
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            spacing={6}
            textAlign="center"
          >
            <Box>
              <Heading size="xl" color={accentColor}>
                50K+
              </Heading>
              <Text>Lives Saved</Text>
            </Box>
            <Box>
              <Heading size="xl" color={accentColor}>
                25K+
              </Heading>
              <Text>Donors Registered</Text>
            </Box>
            <Box>
              <Heading size="xl" color={accentColor}>
                100+
              </Heading>
              <Text>Hospital Partners</Text>
            </Box>
            <Box>
              <Heading size="xl" color={accentColor}>
                24/7
              </Heading>
              <Text>Emergency Service</Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Timeline Section */}
      <Card bg={cardBg} mb={12}>
        <CardHeader>
          <Heading size="lg">Our Journey</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={8}>
            {milestones.map((milestone, index) => (
              <Flex key={index} direction={{ base: "column", md: "row" }}>
                <Box
                  w={{ md: "150px" }}
                  textAlign={{ base: "left", md: "right" }}
                  pr={{ md: 6 }}
                >
                  <Badge
                    colorScheme="red"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {milestone.year}
                  </Badge>
                </Box>
                <Box flex={1} pl={{ md: 6 }} position="relative">
                  <Box
                    position="absolute"
                    left={{ md: "-3px" }}
                    top="0"
                    bottom="0"
                    w="2px"
                    bg={accentColor}
                    display={{ base: "none", md: "block" }}
                  />
                  <Box
                    position="absolute"
                    left={{ md: "-8px" }}
                    top="8px"
                    w="14px"
                    h="14px"
                    borderRadius="full"
                    bg={accentColor}
                    display={{ base: "none", md: "block" }}
                  />
                  <Box
                    bg={useColorModeValue("red.50", "red.900")}
                    p={4}
                    borderRadius="md"
                  >
                    <Text fontWeight="medium">{milestone.event}</Text>
                  </Box>
                </Box>
              </Flex>
            ))}
          </Stack>
        </CardBody>
      </Card>

      {/* Team Section */}
      <Card bg={cardBg} mb={12}>
        <CardHeader>
          <Heading size="lg">Meet Our Team</Heading>
          <Text color={secondaryText} mt={2}>
            The passionate people behind BloodLink
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {teamMembers.map((member, index) => (
              <Card key={index} variant="outline">
                <CardBody textAlign="center">
                  <Avatar
                    size="xl"
                    name={member.name}
                    src={member.avatar}
                    mb={4}
                    bg="red.100"
                    icon={<FiUser fontSize="1.5rem" />}
                  />
                  <Heading size="md" mb={2}>
                    {member.name}
                  </Heading>
                  <Text color={accentColor} mb={3}>
                    {member.role}
                  </Text>
                  <Text color={secondaryText}>{member.bio}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* CTA Section */}
      <Card bg={accentColor} color="white">
        <CardBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading size="lg" mb={2}>
                Ready to Make a Difference?
              </Heading>
              <Text>
                Join our community of life-savers today. It only takes 30
                minutes to donate blood.
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="white"
              variant="outline"
              size="lg"
              rightIcon={<FiDroplet />}
            >
              Donate Now
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AboutUs;
