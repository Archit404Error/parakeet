import { TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Text, View } from "../../../components/Themed";
import { styles } from "../../../styles/screenStyles";
import React, { useRef, useEffect, useState } from "react";
import { playAudio } from "./recordingScreen";
import { useLocalSearchParams } from "expo-router";
import { AssistantMessage } from "../../../components/chat/AssistantMessage";
import { UserMessage } from "../../../components/chat/UserMessage";
import LottieView from "lottie-react-native";

export default function FeedbackScreen() {
  interface feedbackSearchParams {
    content: string[];
  }

  const messageScrollViewRef = useRef<ScrollView>(null);
  const searchParams =
    useLocalSearchParams() as unknown as feedbackSearchParams;
  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    setContent(searchParams.content);
  });

  const handlePlayMessage = (message: string) => {
    playAudio(message);
  };

  const confettiRef = useRef<LottieView>(null);
  function triggerConfetti() {
    confettiRef.current?.play(0);
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.sectionDetailText, marginBottom: 10 }}>
        Awesome job! Here is the corrected conversation for you to review. Click
        on any message to play it back.
      </Text>
      <SafeAreaView style={{ flex: 2 }}>
        <ScrollView
          ref={messageScrollViewRef}
          onContentSizeChange={() =>
            messageScrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={{ ...styles.chatScrollContainer, backgroundColor: "#FFF" }}
        >
          {content.map((message, idx) =>
            idx % 2 === 0 ? (
              <TouchableOpacity
                key={`userMessage${idx}`}
                onPress={() => handlePlayMessage(message)}
              >
                <UserMessage message={`${message}`} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={`aiMessage${idx}`}
                onPress={() => handlePlayMessage(message)}
              >
                <AssistantMessage message={message} />
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </SafeAreaView>
      <LottieView
        ref={confettiRef}
        source={require("../../../assets/confetti.json")}
        autoPlay={false}
        loop={false}
        style={styles.lottie}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.button} onPress={triggerConfetti}>
        <Text style={styles.buttonText}>Celebrate!</Text>
      </TouchableOpacity>
    </View>
  );
}
