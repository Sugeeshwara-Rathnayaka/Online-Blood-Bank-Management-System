import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import { organizationService } from "../api/organizationService";

export default function ReportGenerator({ isOpen, onClose, onGenerate }) {
  const [reportType, setReportType] = useState("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const report = await organizationService.generateReport(reportType);
      onGenerate(report);
      onClose();
    } catch (error) {
      toast({
        title: "Error generating report",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="monthly">Monthly Summary</option>
            <option value="donors">Donor List</option>
            <option value="inventory">Blood Inventory</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            Generate
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
