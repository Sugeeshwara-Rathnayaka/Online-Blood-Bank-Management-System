import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  NumberInput,
  NumberInputField,
  Checkbox,
  Heading,
  Input,
  Select,
  Divider,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiMinus, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export const AddBloodBankModal = ({
  isOpen,
  onClose,
  onSuccess,
  editData,
  resetEditData,
}) => {
  const initialHospitalData = {
    name: "",
    address: "",
    district: "",
    capacity: "",
    isDeleted: false,
  };

  const initialAdminData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    nic: "",
    phone: "",
  };

  const [hospitalData, setHospitalData] = useState(initialHospitalData);
  const [adminData, setAdminData] = useState(initialAdminData);

  const [telephoneNumbers, setTelephoneNumbers] = useState([""]);
  const [flag, setFlag] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setHospitalData({
          name: editData.name,
          address: editData.address,
          district: editData.district,
          capacity: editData.capacity,
          isDeleted: editData.isDeleted,
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, editData]);

  const resetForm = () => {
    setHospitalData(initialHospitalData);
    setAdminData(initialAdminData);
    setTelephoneNumbers([""]);
    setFlag(0);
  };

  const handleHospitalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHospitalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTelephoneChange = (index, value) => {
    setTelephoneNumbers((prev) => {
      const newNumbers = [...prev];
      newNumbers[index] = value;
      return newNumbers;
    });
  };

  const addTelephoneField = () => {
    setTelephoneNumbers((prev) => [...prev, ""]);
  };

  const removeTelephoneField = (index) => {
    if (telephoneNumbers.length > 1) {
      setTelephoneNumbers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        hospitalData,
        adminData,
        telephoneNumbers: telephoneNumbers.filter((num) => num.trim() !== ""),
        flag,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editData) {
        // Update existing bank
        onSuccess({ ...payload.hospitalData, id: editData.id });
      } else {
        // Add new bank
        onSuccess({ ...payload.hospitalData, id: Date.now().toString() });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetEditData?.();
      }}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editData ? "Edit Blood Bank" : "Add New Blood Bank"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Heading size="md" mb={4}>
              Blood Bank Information
            </Heading>

            <FormControl isRequired>
              <FormLabel>Blood Bank Name</FormLabel>
              <Input
                name="name"
                value={hospitalData.name}
                onChange={handleHospitalChange}
                placeholder="Enter blood bank name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={hospitalData.address}
                onChange={handleHospitalChange}
                placeholder="Enter address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>District</FormLabel>
              <Select
                name="district"
                value={hospitalData.district}
                onChange={handleHospitalChange}
                placeholder="Select district"
              >
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                {/* Add more districts as needed */}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Capacity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="capacity"
                  value={hospitalData.capacity}
                  onChange={handleHospitalChange}
                  placeholder="Enter capacity"
                />
              </NumberInput>
            </FormControl>

            <FormControl>
              <Checkbox
                name="isDeleted"
                isChecked={hospitalData.isDeleted}
                onChange={handleHospitalChange}
              >
                Mark as inactive
              </Checkbox>
            </FormControl>

            <Divider my={4} />

            <Heading size="md" mb={4}>
              Admin Information
            </Heading>

            <Flex gap={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={adminData.firstName}
                  onChange={handleAdminChange}
                  placeholder="Enter first name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={adminData.lastName}
                  onChange={handleAdminChange}
                  placeholder="Enter last name"
                />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleAdminChange}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleAdminChange}
                placeholder="Enter password"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>NIC</FormLabel>
              <Input
                name="nic"
                value={adminData.nic}
                onChange={handleAdminChange}
                placeholder="Enter NIC number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={adminData.phone}
                onChange={handleAdminChange}
                placeholder="Enter phone number"
              />
            </FormControl>

            <Divider my={4} />

            <Heading size="md" mb={4}>
              Contact Numbers
            </Heading>

            {telephoneNumbers.map((number, index) => (
              <Flex key={index} gap={2} alignItems="center">
                <FormControl>
                  <Input
                    type="tel"
                    value={number}
                    onChange={(e) =>
                      handleTelephoneChange(index, e.target.value)
                    }
                    placeholder="Enter telephone number"
                  />
                </FormControl>
                {telephoneNumbers.length > 1 && (
                  <IconButton
                    icon={<FiMinus />}
                    onClick={() => removeTelephoneField(index)}
                    aria-label="Remove telephone number"
                    colorScheme="red"
                    variant="ghost"
                  />
                )}
              </Flex>
            ))}

            <Button
              leftIcon={<FiPlus />}
              onClick={addTelephoneField}
              variant="outline"
              w="fit-content"
            >
              Add Another Number
            </Button>

            <FormControl>
              <FormLabel>Flag</FormLabel>
              <Select
                value={flag}
                onChange={(e) => setFlag(parseInt(e.target.value))}
              >
                <option value={0}>Active</option>
                <option value={1}>Pending</option>
                <option value={2}>Suspended</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={() => {
              onClose();
              resetEditData?.();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {editData ? "Update" : "Save"} Blood Bank
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
