import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import DarkRoundedButton from "../../inputs/DarkRoundedButton";

interface IncomingCallCardProps {
  data: { caller_id: string };
  startCall: any;
}

const IncomingCallCard: React.FC<IncomingCallCardProps> = ({
  data,
  startCall,
}) => {
  return (
    <View style={[tw`w-full mb-2 flex flex-row items-center justify-between`]}>
      <Text style={[tw`text-white text-lg mb-1`]}>
        Incoming call from ID{data.caller_id}
      </Text>
      <DarkRoundedButton
        title="Confirm"
        color="white"
        onPress={() => {
          console.log("Confirming call from ID" + data.caller_id);
          startCall();
        }}
      />
    </View>
  );
};

export default IncomingCallCard;
