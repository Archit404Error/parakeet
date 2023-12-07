import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { styles } from "../../../styles/screenStyles";

export default function RecordingOptionsScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [errorShown, setErrorShown] = useState<boolean>(false);
  let presetPrompts = [
    "It's your first day at a new job. You are meeting your coworkers for the first time.",
    "We are at a neighborhood housewarming party. The person next to you starts to make small talk.",
  ];
  let supportedTimes = [30, 60, 90, 120];

  useFocusEffect(
    React.useCallback(() => {
      setPrompt("");
      setSelectedTime(null);
      setErrorShown(false);
    }, [])
  );

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.sectionDetailText}>
          Practice having a real life conversation by prompting the AI with your
          own scenario or selecting one of our suggestions
        </Text>
        {presetPrompts.map((presetPrompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.presetPromptBox}
            onPress={() => setPrompt(presetPrompt)}
          >
            <Text style={styles.presetPromptText}>{presetPrompt}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ ...styles.separator, width: 0 }} />
        <Text style={styles.labelText}>Conversation Type</Text>
        <TextInput
          placeholder="Write your prompt here..."
          maxLength={200}
          value={prompt}
          onChangeText={setPrompt}
          style={styles.promptInput}
          multiline={true}
        />
        <RNPickerSelect
          placeholder={{
            label: "Select conversation length...",
            value: selectedTime,
            fontFamily: "Helvetica Neue",
            fontSize: 16,
          }}
          onValueChange={setSelectedTime}
          items={supportedTimes.map((time) => {
            return { label: `${time} second conversation`, value: time };
          })}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Begin Session</Text>
        </TouchableOpacity>
        {errorShown && (
          <Text style={styles.errorText}>
            Please set a prompt and time before submitting!
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
