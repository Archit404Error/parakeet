import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { textStyles } from "../../../styles/textStyles";
import { viewStyles } from "../../../styles/viewStyles";

export default function RecordingOptionsScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<number>();
  const [errorShown, setErrorShown] = useState<boolean>(false);
  let supportedTimes = [30, 60, 90, 120];

  const handleSubmit = () => {
    if (!prompt || !selectedTime) {
      setErrorShown(true);
      return;
    }

    router.push({
      pathname: "/(tabs)/(stack)/recordingScreen",
      params: { prompt, selectedTime },
    });
  };

  return (
    <View style={viewStyles.container}>
      <Text style={textStyles.sectionTitle}>Speech Session Options</Text>
      <TextInput
        placeholder="Enter prompt..."
        maxLength={200}
        value={prompt}
        onChangeText={setPrompt}
        style={styles.promptInput}
      />
      <RNPickerSelect
        onValueChange={setSelectedTime}
        items={supportedTimes.map((time) => {
          return { label: `${time} second conversation`, value: time };
        })}
        style={{ inputIOS: styles.promptInput }}
      />
      <Button title={"Begin Session"} onPress={handleSubmit} />
      {errorShown && (
        <Text style={textStyles.bodyText}>
          Please set a prompt and time before submitting!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  promptInput: {
    backgroundColor: "gray",
    color: "white",
    borderRadius: 10,
    padding: 15,
    minHeight: 60,
  },
});
