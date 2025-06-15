import { Link } from "expo-router";
import { Text, View, useColorScheme } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme(); // "light" or "dark"

  return (
    <View className = "flex-1 justify-center items-center">
      <Text className = "text-5xl text-primary dark:text-accent font-bold">Welcome!</Text>
      <Link href='/movie/avengers'>Movie Details</Link>
    </View>
  );
}
