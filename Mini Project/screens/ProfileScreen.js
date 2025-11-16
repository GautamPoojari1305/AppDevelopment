import React, { useContext } from "react";
import { View } from "react-native";
import { Text, Button, Switch, useTheme } from "react-native-paper";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileScreen() {
  const user = auth.currentUser;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        variant="headlineMedium"
        style={{ 
          textAlign: "center", 
          color: theme.colors.onBackground, 
          marginBottom: 20 
        }}
      >
        Profile
      </Text>

      <Text style={{ color: theme.colors.onBackground, marginBottom: 10 }}>
        Name: {user?.displayName || "Not set"}
      </Text>

      <Text style={{ color: theme.colors.onBackground }}>
        Email: {user?.email}
      </Text>

      <View
        style={{
          marginTop: 25,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.colors.onBackground, marginRight: 12 }}>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <Button
        mode="contained"
        onPress={() => signOut(auth)}
        style={{ marginTop: 40 }}
      >
        Log Out
      </Button>
    </View>
  );
}
