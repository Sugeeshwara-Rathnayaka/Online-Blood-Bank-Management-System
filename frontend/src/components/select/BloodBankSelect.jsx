import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";
import api from "../../api/api";

const BloodBankSelect = ({ value, onChange, brandColor, bg, placeholder }) => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBloodBanks() {
      setLoading(true);
      try {
        const res = await api.get("/select/get-allbbhos");
        if (Array.isArray(res.data.bBHospitals)) {
          setBloodBanks(res.data.bBHospitals);
        } else {
          console.warn(
            "Expected 'bBHospitals' to be an array but got:",
            res.data
          );
          setBloodBanks([]);
        }
      } catch (error) {
        console.error("Failed to fetch blood banks:", error);
        setBloodBanks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBloodBanks();
  }, []);

  return (
    <Select
      name="bloodBankName"
      value={value}
      onChange={onChange}
      placeholder={
        loading ? "Loading blood banks..." : placeholder || "Select blood bank"
      }
      size="lg"
      focusBorderColor={brandColor}
      bg={bg}
      isDisabled={loading}
    >
      {bloodBanks.map((bank) => (
        <option key={bank._id} value={bank.name}>
          {`${bank.name} - [${bank.district.toUpperCase()}]`}
        </option>
      ))}
    </Select>
  );
};

export default BloodBankSelect;
