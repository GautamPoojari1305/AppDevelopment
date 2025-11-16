import React, { createContext, useState } from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  // ⭐ Neon Blue color
  const neonBlue = "#4FC3F7";

  // 🌞 Light theme with Neon Blue
  const CustomLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: neonBlue,
      secondary: neonBlue,
    },
  };

  // 🌙 Dark theme with Neon Blue
  const CustomDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: neonBlue,
      secondary: neonBlue,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        theme: isDark ? CustomDarkTheme : CustomLightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
