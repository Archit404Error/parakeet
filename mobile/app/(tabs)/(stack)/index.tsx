import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../../../components/Themed";

export default function RecordingScreen() {
  const [audio, setAudio] = useState<Audio.Recording>();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribed, setTranscribed] = useState("");
  const [corrected, setCorrected] = useState("");

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

    const res = await fetch(
      "https://d78b-24-213-201-201.ngrok-free.app/process-audio",
      {
        method: "POST",
        body: uploadData,
      }
    );
    const resJson = await res.json();
    setTranscribed(resJson.transcribed);
    setCorrected(resJson.corrected);
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
