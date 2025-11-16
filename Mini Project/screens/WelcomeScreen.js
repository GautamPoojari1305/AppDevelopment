import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookWorm</Text>
      <Button title="Get Started" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20 }
});
