import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="(stack)"
        options={{
          title: "Conversation",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Speech",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
