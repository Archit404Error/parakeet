import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../../components/Themed";
import { useNavigation } from "expo-router";
import { styles } from "../../../styles/screenStyles";

export default function FeedbackScreen() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionDetailText}>
        Feedback feature coming soon!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
