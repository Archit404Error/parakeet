import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "../../../components/Themed";
import { AssistantMessage } from "../../../components/chat/AssistantMessage";
import { UserMessage } from "../../../components/chat/UserMessage";
import { API_URL } from "../../../constants";

export default function RecordingScreen() {
  enum Role {
    USER = "user",
    ASSISTANT = "assistant",
  }

  interface ConversationContext {
    role: Role;
    content: string;
  }

  const [audio, setAudio] = useState<Audio.Recording>();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribed, setTranscribed] = useState<string[]>([]);
  const [corrected, setCorrected] = useState<string[]>([]);
  const [context, setContext] = useState<ConversationContext[]>([]);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setAudio(recording);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await audio?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    setIsRecording(false);
    await uploadRecording();
    return audio?.getURI();
  };

  const uploadRecording = async () => {
    let uploadData = new FormData();
    const audioURI = audio?.getURI();
    const filetype = audioURI?.split(".").pop();
    const uploadedFileName = audioURI?.split("/").pop();
    //@ts-ignore
    uploadData.append("audio", {
      uri: audioURI,
      name: uploadedFileName,
      type: `audio/${filetype}`,
    });

    const res = await fetch(`${API_URL}/process-audio`, {
      method: "POST",
      body: uploadData,
    });
    const resJson = await res.json();
    setTranscribed([...transcribed, resJson.transcribed]);
    setCorrected([...corrected, resJson.corrected]);

    let updatedContext = [
      ...context,
      { role: Role.USER, content: resJson.corrected },
    ];

    const completionRes = await fetch(`${API_URL}/autocomplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context: updatedContext }),
    });

    const completionJson = await completionRes.json();
    updatedContext.push({
      role: Role.ASSISTANT,
      content: completionJson.autocompletion,
    });

    setContext(updatedContext);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.chatScrollContainer}>
          {context.map((message, idx) =>
            message.role == Role.USER ? (
              <UserMessage
                key={`userMessage${idx}`}
                message={`Original: ${
                  transcribed[Math.floor(idx / 2)]
                }\n\nCorrected: ${message.content}`}
              />
            ) : (
              <AssistantMessage
                key={`aiMessage${idx}`}
                message={message.content}
              />
            )
          )}
        </ScrollView>
      </SafeAreaView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
        >
          <FontAwesome
            name={isRecording ? "stop" : "microphone"}
            size={100}
            color="white"
            style={isRecording ? styles.stopRecording : styles.startRecording}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  chatScrollContainer: {
    padding: 5,
  },
  startRecording: {
    alignSelf: "center",
    backgroundColor: "orange",
    overflow: "hidden",
    borderRadius: 15,
    padding: 20,
  },
  stopRecording: {
    alignSelf: "center",
    backgroundColor: "red",
    overflow: "hidden",
    borderRadius: 15,
    padding: 20,
  },
});
