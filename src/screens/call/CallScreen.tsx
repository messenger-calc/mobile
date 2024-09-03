import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import tw from "twrnc";

import MenuIcon from "../../assets/icons/Menu";

import RegularButton from "../../components/inputs/RegularButton";
import RegularTextInput from "../../components/inputs/RegularTextInput";
import LightTextInput from "../../components/inputs/LightTextInput";
import ProgressButton from "../../components/inputs/ProgressButton";
import GradientSphere from "../../components/common/GradientSphere";
import ChatDisplay from "../../components/call/ChatDisplay";

import MenuDrawer from "../../components/inputs/MenuDrawer";

const { width } = Dimensions.get("window");

const CallScreen = ({
  navigation,
  otherUserNickname,
  finishCall,
  chat,
  nickname,
  onReject,
  onSuccess,
}: any) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isInCall, setIsInCall] = useState(false);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const radius = useSharedValue(width * 1.5);
  const topOff = useSharedValue(-width);
  const bottomOff = useSharedValue(-width);
  const rightOff = useSharedValue(width / 2 - width * 0.5 * 1.5);
  const leftOff = useSharedValue(width / 2 - width * 0.5 * 1.5);
  const textOpacity = useSharedValue(0);

  const topGradientStyle = useAnimatedStyle(() => {
    return {
      width: radius.value,
      height: radius.value,
      borderRadius: radius.value / 2,
      top: topOff.value,
      right: rightOff.value,
    };
  });

  const bottomGradientStyle = useAnimatedStyle(() => {
    return {
      width: radius.value,
      height: radius.value,
      borderRadius: radius.value / 2,
      bottom: bottomOff.value,
      left: leftOff.value,
    };
  });

  useEffect(() => {
    //radius.value = withTiming(width * 1.5, { duration: 3000 });
    //textOpacity.value = withTiming(1, { duration: 3000 });
    // Animate the offsets to their target positions
    // topOff.value = withTiming(-width - 80, { duration: 3000 });
    // bottomOff.value = withTiming(-width - 80, { duration: 3000 });
    rightOff.value = withTiming(width / 2 - width * 0.5 * 1.5 + 120, {
      duration: 3000,
    });
    leftOff.value = withTiming(width / 2 - width * 0.5 * 1.5 + 120, {
      duration: 3000,
    });
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-start bg-black`}>
      <GradientSphere animatedStyle={topGradientStyle} color="#522d83" />
      <GradientSphere animatedStyle={bottomGradientStyle} color="#0f84a7" />
      <View
        style={tw`flex flex-row items-center pb-2 justify-between w-full mt-8 border-b border-zinc-600 px-4`}
      >
        <Text style={[tw`font-bold text-white text-2xl mb-3`]}>Messenger</Text>
        <MenuIcon width={30} height={30} onPress={openDrawer} />
      </View>

      {isInCall ? (
        <ChatDisplay
          navigation={navigation}
          chat={chat}
          finishCall={finishCall}
          nickname={nickname}
          otherUserNickname={otherUserNickname}
        />
      ) : (
        <View style={tw`w-full px-4 items-center justify-center h-5/6`}>
          <LightTextInput placeholder="ID***" />
          <ProgressButton
            setIsInCall={setIsInCall}
            onSuccess={onSuccess}
            onReject={onReject}
          />
        </View>
      )}

      <MenuDrawer
        isOpen={drawerVisible}
        onClose={closeDrawer}
        navigation={navigation}
      />
    </View>
  );
};

export default CallScreen;
