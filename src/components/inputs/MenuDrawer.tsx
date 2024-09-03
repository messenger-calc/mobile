import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import tw from "twrnc";

import CrossIcon from "../../assets/icons/Cross";

const { width, height } = Dimensions.get("window");

interface FullScreenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
}

const FullScreenDrawer: React.FC<FullScreenDrawerProps> = ({
  isOpen,
  onClose,
  navigation,
}) => {
  const drawerAnimation = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: isOpen ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
      <Animated.View
        style={[
          tw`absolute top-0 right-0 w-full h-full bg-black p-5`,
          { transform: [{ translateX: drawerAnimation }] },
        ]}
      >
        <View style={tw`flex-1 justify-start items-center`}>
          <View style={tw`w-full flex items-end`}>
            <TouchableOpacity onPress={onClose} style={tw`mb-6`}>
              <CrossIcon width={50} height={50} />
            </TouchableOpacity>
          </View>
          <View
            style={tw`w-full h-5/6 flex flex-col items-center justify-center`}
          >
            <TouchableOpacity
              onPress={() => {
                navigation("Call");
                onClose();
              }}
              style={tw`mb-4`}
            >
              <Text style={[tw`text-white font-bold`, { fontSize: 40 }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation("Profile");
                onClose();
              }}
              style={tw`mb-4`}
            >
              <Text style={[tw`text-white font-bold`, { fontSize: 40 }]}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
              <Text style={[tw`text-white font-bold`, { fontSize: 40 }]}>
                Notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
              <Text style={[tw`text-white font-bold`, { fontSize: 40 }]}>
                Language
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
              <Text style={[tw`text-white font-bold`, { fontSize: 40 }]}>
                Style
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default FullScreenDrawer;
