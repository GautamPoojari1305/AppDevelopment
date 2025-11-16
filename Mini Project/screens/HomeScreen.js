import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { TextInput, Text, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const categories = [
    { label: "Manga", icon: "book" },
    { label: "Romance", icon: "heart" },
    { label: "Adventure", icon: "planet" },
    { label: "Fiction", icon: "library" },
    { label: "Fantasy", icon: "sparkles" },
    { label: "Science Fiction", icon: "rocket" },
    { label: "Mystery", icon: "help-circle" },
    { label: "Thriller", icon: "flash" },
    { label: "Horror", icon: "skull" },
    { label: "Biography", icon: "person" },
    { label: "History", icon: "time" },
    { label: "Self Help", icon: "happy" },
    { label: "Poetry", icon: "leaf" },
  ];

  const searchBook = async () => {
    if (!query.trim()) return;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data.items || []);
  };

  const searchCategory = async (category) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
      category
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data.items || []);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingTop: 35 }}
    >
      {/* 🔍 Search Bar */}
      <TextInput
        label="Search for a book"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchBook}
        style={{ marginBottom: 20 }}
      />

      {/* 🎭 Category Chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.label}
        contentContainerStyle={{ paddingVertical: 8 }}
        style={{ marginBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => searchCategory(item.label)}
            style={{
              backgroundColor: "#e8f7ff",
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 25,
              marginRight: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color="#4FC3F7"
              style={{ marginRight: 6 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 📘 Book Grid */}
      <FlatList
        data={books}
        numColumns={2}
        scrollEnabled={false} // IMPORTANT: let ScrollView handle scrolling
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const info = item.volumeInfo;
          const thumbnail =
            info.imageLinks?.thumbnail ||
            "https://via.placeholder.com/150?text=No+Image";

          return (
            <View style={{ width: "48%" }}>
              <Card
                style={{
                  marginBottom: 15,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
                onPress={() =>
                  navigation.navigate("BookDetails", { book: item })
                }
              >
                <Card.Cover source={{ uri: thumbnail }} />
                <Card.Title
                  title={info.title || "No Title"}
                  titleStyle={{ fontSize: 14 }}
                />
              </Card>
            </View>
          );
        }}
      />
    </ScrollView>
  );
}
