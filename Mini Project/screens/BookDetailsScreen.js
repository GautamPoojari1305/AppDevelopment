import React from "react";
import { ScrollView, Linking } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";

export default function BookDetailsScreen({ route }) {
  const { book } = route.params; // passed from HomeScreen
  const info = book.volumeInfo;
  const theme = useTheme();

  const thumbnail =
    info.imageLinks?.thumbnail ||
    "https://via.placeholder.com/200?text=No+Image";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 15 }}
    >
      {/* Cover Image */}
      <Card>
        <Card.Cover source={{ uri: thumbnail }} />
      </Card>

      {/* Title */}
      <Text variant="headlineMedium" style={{ marginTop: 20, color: theme.colors.onBackground }}>
        {info.title}
      </Text>

      {/* Authors */}
      <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>
        <Text style={{ fontWeight: "bold" }}>Author(s): </Text>
        {info.authors ? info.authors.join(", ") : "Unknown"}
      </Text>

      {/* Published Date */}
      <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>
        <Text style={{ fontWeight: "bold" }}>Published: </Text>
        {info.publishedDate || "Unknown"}
      </Text>

      {/* Publisher */}
      <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>
        <Text style={{ fontWeight: "bold" }}>Publisher: </Text>
        {info.publisher || "Unknown"}
      </Text>

      {/* Description */}
      <Text
        style={{
          marginTop: 20,
          fontSize: 15,
          lineHeight: 22,
          color: theme.colors.onBackground,
        }}
      >
        {info.description || "No description available."}
      </Text>

      {/* Preview Link */}
      {info.previewLink && (
        <Button
          mode="contained"
          style={{ marginTop: 30 }}
          onPress={() => Linking.openURL(info.previewLink)}
        >
          Preview Book
        </Button>
      )}
    </ScrollView>
  );
}
