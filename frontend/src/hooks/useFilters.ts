import { useState } from "react";
import Noodle from "../types";

export default function useFilters() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const matchesFilter = (noodle: Noodle) => {
    const matchesBrand = selectedBrand ? noodle.brand === selectedBrand : true;
    const matchesCountry = selectedCountry
      ? noodle.originCountry === selectedCountry
      : true;

    return matchesBrand && matchesCountry;
  };

  return {
    filters: {
      selectedBrand,
      selectedCountry,
    },
    setSelectedBrand,
    setSelectedCountry,
    matchesFilter,
  };
}
