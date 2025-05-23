import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";
import api from "../../api/api";

const BloodTypeSelect = ({ value, onChange, brandColor, bg, placeholder }) => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBloodTypes() {
      setLoading(true);
      try {
        const res = await api.get("/select/get-bloodtypes");
        if (Array.isArray(res.data.bloodTypes)) {
          setBloodTypes(res.data.bloodTypes);
        } else {
          console.warn(
            "Expected 'bloodTypes' to be an array but got:",
            res.data
          );
          setBloodTypes([]);
        }
      } catch (error) {
        console.error("Failed to fetch blood types:", error);
        setBloodTypes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBloodTypes();
  }, []);

  return (
    <Select
      name="bloodType"
      value={value}
      onChange={onChange}
      placeholder={
        loading ? "Loading blood types..." : placeholder || "Select blood type"
      }
      size="lg"
      focusBorderColor={brandColor}
      bg={bg}
      isDisabled={loading}
    >
      {bloodTypes.map((item) => (
        <option key={item._id} value={item.type}>
          {item.type}
        </option>
      ))}
    </Select>
  );
};

export default BloodTypeSelect;
