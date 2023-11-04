import { Message } from "./Message";

interface MessageProps {
  message: string;
}

export const AssistantMessage = ({ message }: MessageProps) => {
  const assistantMessageColor = "#004502";
  const assistantTextColor = "#ffffff";
  const assistantAlign = "flex-start";

  return (
    <Message
      message={message}
      bgColor={assistantMessageColor}
      color={assistantTextColor}
      align={assistantAlign}
    />
  );
};
