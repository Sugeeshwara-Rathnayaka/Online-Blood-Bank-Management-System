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
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Divider,
  Avatar,
  useToast,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiArrowLeft,
  FiDollarSign,
  FiCreditCard,
  FiHeart,
} from "react-icons/fi";
import { useState } from "react";
import api from "../api/api";

const CashDonate = () => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.700");
  const secondaryText = useColorModeValue("gray.600", "gray.400");

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "creditCard",
    frequency: "oneTime",
    name: "",
    email: "",
    phone: "",
    dedication: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual API endpoint
      await api.post("/donations/cash", formData);

      toast({
        title: "Donation Successful!",
        description: "Thank you for your generous contribution.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form after successful submission
      setFormData({
        amount: "",
        paymentMethod: "creditCard",
        frequency: "oneTime",
        name: "",
        email: "",
        phone: "",
        dedication: "",
      });
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Suggested donation amounts
  const suggestedAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* <Button
        as={RouterLink}
        to="/donor-dashboard"
        leftIcon={<FiArrowLeft />}
        variant="outline"
        mb={6}
      >
        Back to Dashboard
      </Button> */}

      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        {/* Donation Form */}
        <Box flex={2}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg">
                Make a Cash Donation - Your contribution helps save lives
              </Heading>
              {/* <Text color={secondaryText} mt={2}>
                Your contribution helps save lives
              </Text> */}
            </CardHeader>

            <CardBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  {/* Donation Amount */}
                  <FormControl isRequired>
                    <FormLabel>Donation Amount (LKR)</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiDollarSign color="gray.300" />
                      </InputLeftElement>
                      <Input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="100"
                      />
                    </InputGroup>
                    <Flex mt={2} wrap="wrap" gap={2}>
                      {suggestedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              amount: amount.toString(),
                            })
                          }
                        >
                          LKR {amount.toLocaleString()}
                        </Button>
                      ))}
                    </Flex>
                  </FormControl>

                  {/* Donation Frequency
                  <FormControl>
                    <FormLabel>Donation Frequency</FormLabel>
                    <RadioGroup
                      name="frequency"
                      value={formData.frequency}
                      onChange={(value) =>
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <Stack direction="row" spacing={4}>
                        <Radio value="oneTime">One-time</Radio>
                        <Radio value="monthly">Monthly</Radio>
                        <Radio value="quarterly">Quarterly</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl> */}

                  <Divider />

                  {/* Payment Method */}
                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <RadioGroup
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(value) =>
                        setFormData({ ...formData, paymentMethod: value })
                      }
                    >
                      <Stack direction="column" spacing={4}>
                        <Radio value="creditCard">
                          <Flex align="center">
                            <Icon as={FiCreditCard} mr={2} />
                            Credit/Debit Card
                          </Flex>
                        </Radio>
                        <Radio value="bankTransfer">
                          <Flex align="center">
                            {/* <Icon as={FiBank} mr={2} /> */}
                            Bank Transfer
                          </Flex>
                        </Radio>
                        <Radio value="digitalWallet">
                          <Flex align="center">
                            <Icon as={FiCreditCard} mr={2} />
                            Digital Wallet (Visa/Master)
                          </Flex>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <Divider />

                  {/* Personal Information */}
                  <Heading size="md">Your Information</Heading>

                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </FormControl>

                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="07X XXX XXXX"
                      />
                    </FormControl>
                  </Flex>

                  <FormControl>
                    <FormLabel>Dedication (Optional)</FormLabel>
                    <Input
                      name="dedication"
                      value={formData.dedication}
                      onChange={handleChange}
                      placeholder="In memory/honor of someone"
                    />
                  </FormControl>
                </Stack>
              </form>
            </CardBody>

            <CardFooter>
              <Button
                colorScheme="red"
                size="lg"
                width="full"
                onClick={handleSubmit}
                leftIcon={<FiHeart />}
              >
                Donate Now
              </Button>
            </CardFooter>
          </Card>
        </Box>

        {/* Impact & Info */}
        <Box flex={1}>
          <Card bg={cardBg} mb={6}>
            <CardHeader>
              <Heading size="md">Your Impact</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex align="center">
                  <Avatar
                    bg="red.100"
                    icon={<FiHeart color="red.500" />}
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="bold">LKR 5,000</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Buys blood testing kits for 10 donations
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Avatar
                    bg="blue.100"
                    icon={<FiHeart color="blue.500" />}
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="bold">LKR 10,000</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Supports a mobile blood donation unit for a day
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Avatar
                    bg="green.100"
                    icon={<FiHeart color="green.500" />}
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="bold">LKR 25,000</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Funds emergency blood transport for a month
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Donation Security</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex align="flex-start">
                  <Badge colorScheme="green" mr={3} mt={1}>
                    ✓
                  </Badge>
                  <Box>
                    <Text fontWeight="medium">Secure Payments</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      256-bit SSL encryption
                    </Text>
                  </Box>
                </Flex>
                <Flex align="flex-start">
                  <Badge colorScheme="green" mr={3} mt={1}>
                    ✓
                  </Badge>
                  <Box>
                    <Text fontWeight="medium">Tax Deductible</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Get a receipt for tax purposes
                    </Text>
                  </Box>
                </Flex>
                <Flex align="flex-start">
                  <Badge colorScheme="green" mr={3} mt={1}>
                    ✓
                  </Badge>
                  <Box>
                    <Text fontWeight="medium">No Hidden Fees</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      100% of your donation goes to our mission
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default CashDonate;
