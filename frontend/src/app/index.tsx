import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { useQuery } from "@apollo/client";
import GET_NOODLES from "../queries";
import NoodleItem from "../components/NoodleItem";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function NoodleListScreen() {
  const [spicinessLevel, setSpicinessLevel] = React.useState<
    number | undefined
  >();
  const [originCountry, setOriginCountry] = React.useState<
    string | undefined
  >();
  const router = useRouter();

  const { loading, error, data } = useQuery<{
    instantNoodles: { id: string; name: string }[];
  }>(GET_NOODLES, {
    variables: {
      spicinessLevel,
      originCountry,
    },
  });

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Noodles",
          headerRight: () => (
            <Text
              style={styles.favouritesButton}
              onPress={() => router.push("/favourites" as any)}
            >
              Favourites
            </Text>
          ),
        }}
      />
      <View style={styles.filters}>
        <Text>Spiciness:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(text) =>
            setSpicinessLevel(text ? parseInt(text, 10) : undefined)
          }
          placeholder="1-5"
        />
        <Text>Origin Country:</Text>
        <Picker
          selectedValue={originCountry}
          onValueChange={(value: any) =>
            setOriginCountry(value === "any" ? undefined : value)
          }
        >
          <Picker.Item label="Any" value="any" />
          <Picker.Item label="Korea" value="KOREA" />
          <Picker.Item label="Japan" value="JAPAN" />
          <Picker.Item label="China" value="CHINA" />
        </Picker>
      </View>

      <FlatList
        data={data?.instantNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
  filters: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  favouritesButton: {
    marginRight: 16,
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
  },
});
