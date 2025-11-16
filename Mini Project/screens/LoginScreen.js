import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.navigate("Dashboard"))
      .catch(err => alert(err.message));
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
      }}
    >
      <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        style={{ marginBottom: 15 }}
      />

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button mode="contained" onPress={login} style={{ marginTop: 25 }}>
        Login
      </Button>

      <Text
        style={{ textAlign: "center", marginTop: 20 }}
        onPress={() => navigation.navigate("Signup")}
      >
        Don't have an account? Sign up
      </Text>
    </View>
  );
}
