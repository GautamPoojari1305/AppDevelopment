import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
function Main() {
  const { theme } = useContext(ThemeContext);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
