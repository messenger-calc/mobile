import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import tw from "twrnc";

interface ProgressButtonProps {
  setIsInCall: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: any;
  onReject: any;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  setIsInCall,
  onSuccess,
  onReject,
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  let animation: any;

  const handleStartPress = () => {
    progress.setValue(0);
    setIsCalling(true);
    onSuccess();
    animation = Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setIsCalling(false);
      setIsInCall(true);
    });
  };

  const handleStopPress = () => {
    if (animation) {
      progress.stopAnimation();
    }
    setIsCalling(false);
    progress.setValue(0);
    setIsInCall(false);
    onReject();
  };

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={tw`w-full`}>
      <TouchableOpacity
        onPress={handleStartPress}
        style={[tw`p-3 bg-zinc-800 rounded-3xl w-full mt-3`, styles.shadowBox]}
        disabled={isCalling}
      >
        <Text style={tw`text-center text-white font-bold text-xl mb-2`}>
          {isCalling ? "Calling..." : "Start Call"}
        </Text>
        <View style={tw`w-full h-2 bg-gray-300 rounded-md overflow-hidden`}>
          <Animated.View
            style={[tw`h-full bg-blue-600`, { width: widthInterpolated }]}
          />
        </View>
      </TouchableOpacity>

      {isCalling && (
        <TouchableOpacity onPress={handleStopPress} style={tw`p-3 w-full mt-1`}>
          <Text style={tw`text-center text-zinc-500 text-lg underline`}>
            Stop Calling
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProgressButton;

const styles = StyleSheet.create({
  shadowBox: {
    shadowColor: "white",
    shadowOffset: { width: 10, height: 30 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
