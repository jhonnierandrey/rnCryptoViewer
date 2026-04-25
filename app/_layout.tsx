import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "../src/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Crypto Viewer",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
