import { Stack } from "expo-router";
import './global.css'; // Import global styles
import { StatusBar } from "react-native";
import { SavedMoviesProvider } from "@/contexts/SavedMoviesContext";

export default function RootLayout() {
  return (
    <SavedMoviesProvider>
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </SavedMoviesProvider>
  );
}
