import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import useFavourites from "../../hooks/useFavorites";

// --- GraphQL Queries and Mutations ---

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      imageURL
      reviewsCount
      category {
        name
      }
    }
  }
`;

const LEAVE_REVIEW = gql`
  mutation LeaveReview($id: ID!) {
    leaveReview(id: $id) {
      id
      reviewsCount
    }
  }
`;

// --- Component ---

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const { addFavourite, removeFavourite, isFavourite } = useFavourites();

  const [leaveReview] = useMutation(LEAVE_REVIEW, {
    variables: { id },
    optimisticResponse: {
      leaveReview: {
        id,
        reviewsCount: (data?.instantNoodle?.reviewsCount ?? 0) + 1,
        __typename: "InstantNoodle",
      },
    },
    update(cache, { data: mutationData }) {
      cache.modify({
        id: cache.identify({ id, __typename: "InstantNoodle" }),
        fields: {
          reviewsCount() {
            return mutationData?.leaveReview?.reviewsCount;
          },
        },
      });
    },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data?.instantNoodle) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load noodle details.</Text>
      </View>
    );
  }

  const noodle = data.instantNoodle;
  const isFav = isFavourite(noodle.id); // ✅ safe to access now

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: noodle.name }} />

      {noodle.imageURL && (
        <Image
          source={{ uri: noodle.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{noodle.name}</Text>
      <Text style={styles.subtitle}>Brand: {noodle.brand}</Text>

      <View style={styles.tags}>
        <Text style={styles.tag}>🌍 {noodle.originCountry}</Text>
        <Text style={styles.tag}>🔥{"🔥".repeat(noodle.spicinessLevel)}</Text>
        <Text style={styles.tag}>⭐ {noodle.rating}/10</Text>
        <Text style={styles.tag}>📦 {noodle.category?.name}</Text>
      </View>

      {/* Reviews Count & Button */}
      <Text style={styles.reviewText}>Reviews: {noodle.reviewsCount}</Text>
      <Button title="Leave Review" onPress={() => leaveReview()} />
      <Button
        title={isFav ? "Remove from Favourites" : "Add to Favourites"}
        onPress={() =>
          isFav ? removeFavourite(noodle.id) : addFavourite(noodle.id)
        }
      />
    </ScrollView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 16,
    marginVertical: 12,
  },
});
