import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // home screen
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  sectionDetailText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "300",
    color: "#909090",
    marginBottom: 30,
    fontFamily: "Helvetica Neue",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4E4E4E",
    marginTop: 30,
    marginBottom: 10,
    fontFamily: "Helvetica Neue",
  },
  promptInput: {
    height: 120,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
    fontFamily: "Helvetica Neue",
    fontSize: 16,
  },
  picker: {
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: "#F9F9F9",
    paddingVertical: 12,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Helvetica Neue",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Helvetica Neue",
  },
  presetPromptBox: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  presetPromptText: {
    textAlign: "center",
    fontSize: 16,
    color: "#909090",
    fontFamily: "Helvetica Neue",
  },

  // recording screen
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
    alignSelf: "center",
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
