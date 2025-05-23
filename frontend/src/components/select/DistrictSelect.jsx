import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";
import api from "../../api/api";

const DistrictSelect = ({ value, onChange, brandColor, bg, placeholder }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDistricts() {
      setLoading(true);
      try {
        const res = await api.get("/select/get-districts");
        if (Array.isArray(res.data.districts)) {
          setDistricts(res.data.districts);
        } else {
          console.warn(
            "Expected 'districts' to be an array but got:",
            res.data
          );
          setDistricts([]);
        }
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDistricts();
  }, []);

  return (
    <Select
      name="district"
      value={value}
      onChange={onChange}
      placeholder={
        loading ? "Loading districts..." : placeholder || "Select district"
      }
      size="lg"
      focusBorderColor={brandColor}
      bg={bg}
      isDisabled={loading}
    >
      {districts.map((district) => (
        <option key={district._id} value={district.name}>
          {district.name}
        </option>
      ))}
    </Select>
  );
};

export default DistrictSelect;
