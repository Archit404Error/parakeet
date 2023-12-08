import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

const TabBarIcon = ({ name, color }: TabBarIconProps) => (
  <FontAwesome
    name={name}
    color={color}
    size={28}
    style={{ marginBottom: -3 }}
  />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Conversation",
        }}
      />
      <Stack.Screen name="recordingScreen" />
      <Stack.Screen name="feedbackScreen" />
    </Stack>
  );
}
