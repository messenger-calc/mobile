import React from "react";
import { View, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

interface ChatMessageProps {
  data: {
    text: string;
    isOwnMessage: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ data, ...props }) => {
  return (
    <View
      style={tw` w-full flex ${
        data.isOwnMessage ? "items-end" : "items-start"
      }`}
    >
      <LinearGradient
        colors={
          data.isOwnMessage ? ["#0e0e0e", "#383838"] : ["#7739cc", "#2b77c0"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[tw`rounded-2xl px-3 py-3`]}
      >
        <View style={[tw`w-1/2`]}>
          <Text style={tw`text-white font-bold`}>{data.text}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ChatMessage;
