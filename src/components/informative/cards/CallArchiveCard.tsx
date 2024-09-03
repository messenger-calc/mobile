import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import RelativeTime from "../RelativeTime";

interface CallArchiveCardProps {
  data: { opponent_id: string; call_date: Date };
}

const CallArchiveCard: React.FC<CallArchiveCardProps> = ({ data }) => {
  return (
    <View
      style={[
        tw`w-full p-4 border border-zinc-600 rounded-lg mb-2`,
        { backgroundColor: "#333333" },
      ]}
    >
      <Text style={[tw`font-bold text-white text-lg mb-1`]}>
        Call with ID{data.opponent_id}
      </Text>
      <RelativeTime date={data.call_date} />
    </View>
  );
};

export default CallArchiveCard;
