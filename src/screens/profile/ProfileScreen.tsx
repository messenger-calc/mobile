import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import tw from "twrnc";

import MenuIcon from "../../assets/icons/Menu";
import ProfilePIctureIcon from "../../assets/icons/ProfilePicture";

import CallArchiveCard from "../../components/informative/cards/CallArchiveCard";
import IncomingCallCard from "../../components/informative/cards/IncomingCallCard";
import MenuDrawer from "../../components/inputs/MenuDrawer";

//test data
const NOW = new Date();
const INCOMING_CALLS = [{ caller_id: "20684" }, { caller_id: "489" }];
// const CALL_ARCHIVE = [
//   { opponent_id: "20684", call_date: new Date(NOW.getTime() - 10000000) },
//   { opponent_id: "489", call_date: new Date(NOW.getTime() - 10000) },
//   { opponent_id: "121", call_date: new Date(NOW.getTime() - 10000000000) },
// ];

const ProfileScreen = ({ navigation, callFrom, startCall, nickname }: any) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <View style={tw`flex-1 items-center justify-start bg-black`}>
      <View
        style={tw`flex flex-row items-center pb-2 justify-between w-full mt-8 border-b border-zinc-600 px-4`}
      >
        <Text style={[tw`font-bold text-white text-2xl mb-3`]}>Messenger</Text>
        <MenuIcon width={30} height={30} onPress={openDrawer} />
      </View>
      <View style={tw`w-full flex justify-center items-center mt-12`}>
        <ProfilePIctureIcon height={100} width={100} />
        <Text style={tw`text-white font-semibold text-xl`}>{nickname}</Text>
      </View>
      <View style={tw`px-4 w-full mt-10`}>
        <Text style={[tw`font-bold text-white text-2xl mb-3`]}>
          Confirm Call
        </Text>

        {callFrom !== "" && (
          <IncomingCallCard
            data={{ caller_id: callFrom }}
            startCall={startCall}
          />
        )}

        <Text style={[tw`font-bold text-white text-2xl mb-3 mt-3`]}>
          Call Archive
        </Text>
        {/* {CALL_ARCHIVE.map((item, index) => (
          <CallArchiveCard key={index} data={item} />
        ))} */}
      </View>
      <MenuDrawer
        isOpen={drawerVisible}
        onClose={closeDrawer}
        navigation={navigation}
      />
    </View>
  );
};

export default ProfileScreen;
