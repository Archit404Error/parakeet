import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "../../../components/Themed";
import { AssistantMessage } from "../../../components/chat/AssistantMessage";
import { UserMessage } from "../../../components/chat/UserMessage";
import { API_URL } from "../../../constants";
import { styles } from "../../../styles/screenStyles";

export default function RecordingScreen() {
  const router = useRouter();

  interface recordingSearchParams {
    prompt: string;
    selectedTime: number;
  }

  enum Role {
    USER = "user",
    ASSISTANT = "assistant",
  }

  interface ConversationContext {
    role: Role;
    content: string;
  }

  const [prompt, setPrompt] = useState<string>("");
  const [conversationTimeSeconds, setConversationTimeSeconds] =
    useState<number>();
  const [audio, setAudio] = useState<Audio.Recording>();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribed, setTranscribed] = useState<string[]>([]);
  const [corrected, setCorrected] = useState<string[]>([]);
  const [context, setContext] = useState<ConversationContext[]>([]);
  const searchParams =
    useLocalSearchParams() as unknown as recordingSearchParams;
  const messageScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setPrompt(searchParams.prompt);
    setConversationTimeSeconds(searchParams.selectedTime);
    const timerIntervalId = setInterval(() => {
      setConversationTimeSeconds(
        (conversationTimeSeconds) => conversationTimeSeconds! - 1
      );
    }, 1000);

    return () => clearInterval(timerIntervalId);
  }, []);

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
      body: JSON.stringify({ context: updatedContext, scenario: prompt }),
    });

    const completionJson = await completionRes.json();
    updatedContext.push({
      role: Role.ASSISTANT,
      content: completionJson.autocompletion,
    });

    setContext(updatedContext);

    await playAudio();
  };

  async function playAudio() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../output.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log("An error occurred while playing the audio:", error);
    }
  }

  const handleEndPractice = () => {
    router.push({
      pathname: "/feedbackScreen",
      params: {},
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.sectionDetailText, marginBottom: 10 }}>
        Prompt: {prompt}
      </Text>
      <Text
        style={{
          ...styles.labelText,
          textAlign: "center",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        {conversationTimeSeconds! > 0
          ? `${conversationTimeSeconds} seconds remaining`
          : "Times up! Wrap up your conversation now..."}
      </Text>
      <SafeAreaView style={{ flex: 2 }}>
        <ScrollView
          ref={messageScrollViewRef}
          onContentSizeChange={() =>
            messageScrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={{ ...styles.chatScrollContainer, backgroundColor: "#FFF" }}
        >
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
      <View style={{ ...styles.separator, backgroundColor: "#DDD" }} />
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={{ backgroundColor: "white", borderRadius: 50 }}
      >
        <FontAwesome
          name={isRecording ? "stop" : "microphone"}
          size={80}
          color="white"
          style={isRecording ? styles.stopRecording : styles.startRecording}
        />
      </TouchableOpacity>
      <View style={{ ...styles.separator, width: 0, marginVertical: 10 }} />
      <TouchableOpacity style={styles.button} onPress={handleEndPractice}>
        <Text style={styles.buttonText}>End Practice {" > "}</Text>
      </TouchableOpacity>
    </View>
  );
}
