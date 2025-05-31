import { View, Text, Button, StyleSheet } from "react-native";

export default function FilterBar({
  selectedBrand,
  selectedCountry,
  onSelectBrand,
  onSelectCountry,
}: {
  selectedBrand: string | null;
  selectedCountry: string | null;
  onSelectBrand: (b: string | null) => void;
  onSelectCountry: (c: string | null) => void;
}) {
  return (
    <View style={styles.bar}>
      <Text>Filter:</Text>
      <Button title="All Brands" onPress={() => onSelectBrand(null)} />
      <Button title="Brand: Samyang" onPress={() => onSelectBrand("Samyang")} />
      <Button title="Country: Korea" onPress={() => onSelectCountry("Korea")} />
      <Button title="All Countries" onPress={() => onSelectCountry(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 12,
  },
});
