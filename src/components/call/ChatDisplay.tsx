import React, { useEffect, useState, useContext, createContext } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import tw from "twrnc";
import PeerConnection from "../../utils/PeerConnection";

import DarkRoundedButton from "../inputs/DarkRoundedButton";
import ChatMessage from "../informative/cards/ChatMessage";
import LightTextInput from "../inputs/LightTextInput";

// const CHAT_LOGS = [
//   { text: "Hello, are you good after yesterday?", isOwnMessage: false },
//   { text: "I`m good, thanks! How about you?", isOwnMessage: true },
//   { text: "I`m good too!", isOwnMessage: false },
//   { text: "Do you have any plans today evening?", isOwnMessage: true },
//   { text: "Sleeping)", isOwnMessage: false },
//   { text: "Me too!)", isOwnMessage: true },
// ];
type TPeerConnectionContext = {
  connection: PeerConnection;
};

export const PeerConnectionContext = createContext<TPeerConnectionContext>({
  connection: {} as PeerConnection,
});

const ChatDisplay = ({
  navigation,
  chat,
  nickname,
  finishCall,
  otherUserNickname,
}: any) => {
  const { connection } = useContext(PeerConnectionContext);
  const [inputValue, setInputValue] = useState("");

  return (
    <View
      style={tw`w-full px-4 h-5/6 flex-1 justify-between items-center py-8`}
    >
      <View style={tw`w-full flex flex-row justify-between items-center`}>
        <Text style={[tw`font-bold text-white text-2xl `]}>
          Call with {otherUserNickname}
        </Text>
        <DarkRoundedButton
          title="End call"
          onPress={() => {
            navigation("Profile");
            finishCall();
          }}
          style={{ backgroundColor: "white" }}
          color="black"
        />
      </View>

      <View style={tw`flex flex-col w-full justify-start items-start`}>
        <View style={tw`flex w-full items-center mb-6`}>
          <Text style={[tw`font-bold text-white text-2xl `]}>Chat</Text>
        </View>
        {chat.map((item: any, index: any) => (
          <ChatMessage key={index} data={item} />
        ))}
      </View>

      <View style={tw`w-full flex flex-row justify-between items-center`}>
        <LightTextInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder="Type a message..."
          additionalStyles={{ width: "75%" }}
          additionalInputStyles={tw`rounded-2xl`}
        />
        <DarkRoundedButton
          title="Send"
          onPress={() => {
            console.log("Msg sent :");
            connection.sendMessage({ text: inputValue, from: nickname });
          }}
          style={{ backgroundColor: "white" }}
          color="black"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    textShadowColor: "#9c9c9c",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
});

export default ChatDisplay;
