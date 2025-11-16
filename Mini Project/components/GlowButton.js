import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function GlowButton({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#4FC3F7",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#4FC3F7",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
