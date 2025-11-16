import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => updateProfile(auth.currentUser, { displayName: name }))
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
        Create Account
      </Text>

      <TextInput
        label="Name"
        mode="outlined"
        onChangeText={setName}
        style={{ marginBottom: 15 }}
      />

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

      <Button mode="contained" onPress={signup} style={{ marginTop: 25 }}>
        Sign Up
      </Button>

      <Text
        style={{ textAlign: "center", marginTop: 20 }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}
