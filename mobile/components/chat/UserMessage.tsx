import { Message } from "./Message";

interface MessageProps {
  message: string;
}

export const UserMessage = ({ message }: MessageProps) => {
  const userMessageColor = "#033669";
  const userTextColor = "#ffffff";
  const userAlign = "flex-end";

  return (
    <Message
      message={message}
      bgColor={userMessageColor}
      color={userTextColor}
      align={userAlign}
    />
  );
};
