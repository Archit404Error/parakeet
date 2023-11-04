import { ColorValue, FlexAlignType, Text, View } from "react-native";

interface MessageProps {
  message: string;
  bgColor: ColorValue;
  color: ColorValue;
  align: "auto" | FlexAlignType | undefined;
}

export const Message = ({ message, bgColor, color, align }: MessageProps) => {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        alignSelf: align,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: color }}>{message}</Text>
    </View>
  );
};
