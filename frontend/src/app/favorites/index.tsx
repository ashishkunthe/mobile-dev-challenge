import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { gql, useQuery } from "@apollo/client";
import useFavourites from "../../hooks/useFavorites";
import useFilters from "../../hooks/useFilters";
import FilterBar from "../../components/FilterBar";
import NoodleCard from "../../components/NoodleCard";

const GET_ALL_NOODLES = gql`
  query GetAllNoodles {
    instantNoodles {
      id
      name
      brand
      rating
      spicinessLevel
      originCountry
      imageURL
    }
  }
`;

export default function FavouritesPage() {
  const { favourites, removeFavourite } = useFavourites();
  const {
    filters: { selectedBrand, selectedCountry },
    setSelectedBrand,
    setSelectedCountry,
    matchesFilter,
  } = useFilters();

  const { loading, error, data } = useQuery(GET_ALL_NOODLES);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error loading favourites.</Text>;

  const filtered = data.instantNoodles
    .filter((n: any) => favourites.includes(n.id))
    .filter(matchesFilter);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FilterBar
        selectedBrand={selectedBrand}
        selectedCountry={selectedCountry}
        onSelectBrand={setSelectedBrand}
        onSelectCountry={setSelectedCountry}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoodleCard
            noodle={item}
            isFavourite={true}
            onRemoveFavourite={() => removeFavourite(item.id)}
          />
        )}
      />
    </View>
  );
}
