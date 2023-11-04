import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../../../components/Themed";
import { API_URL } from "../../../constants";

export default function RecordingScreen() {
  interface ConversationContext {
    role: string;
    content: string;
  }

  const [audio, setAudio] = useState<Audio.Recording>();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribed, setTranscribed] = useState("");
  const [corrected, setCorrected] = useState("");
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
    setTranscribed(resJson.transcribed);
    setCorrected(resJson.corrected);

    let updatedContext = [
      ...context,
      { role: "user", content: resJson.corrected },
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
      role: "assistant",
      content: completionJson.autocompletion,
    });

    setContext(updatedContext);
    console.log(updatedContext);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Audio</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {transcribed && <Text style={styles.title}>Original: {transcribed}</Text>}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {corrected && <Text style={styles.title}>Corrected: {corrected}</Text>}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {context.length > 0 && (
        <Text style={styles.title}>
          Response: {context[context.length - 1].content}
        </Text>
      )}
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
        <FontAwesome
          name={isRecording ? "stop" : "microphone"}
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <Link href="/stacked" asChild>
        <Button title="Press to stack screen" />
      </Link>
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
});
