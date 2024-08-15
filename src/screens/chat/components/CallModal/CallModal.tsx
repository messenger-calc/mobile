import {Animated, StyleSheet, View} from "react-native";
import React, {useEffect, useRef} from "react";
import {Svg} from "../../../../assets/icons";
import {ButtonIcon, ButtonIconDisable, CallModalView, Control, Inner, Title} from "./styled";
import { CallModalProps } from "./types";

export const CallModal = ({callFrom, startCall, rejectCall}: CallModalProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated
            .loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true
                    })
                ])
            ).start()
    }, []);

    const acceptWithVideo = (video: boolean) => {
        const config = {audio: true, video}
        startCall(false, callFrom!, config)
    }
    return (
        <View style={styles.callModal}>
            <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                <CallModalView style={styles.callModalShadow}>
                    <Inner>
                        <Title>{`${callFrom} is calling`}</Title>
                        <Control>
                            <ButtonIcon onPress={() => acceptWithVideo(false)} style={styles.buttonShadow}>
                                <Svg.Smartphone fill={'#fff'}/>
                            </ButtonIcon>
                            <ButtonIconDisable onPress={rejectCall} style={styles.buttonShadow}>
                                <Svg.PhoneDisable fill={'#fff'}/>
                            </ButtonIconDisable>
                        </Control>
                    </Inner>
                </CallModalView>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    callModal: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    callModalShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 3,
    },
    buttonShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 3,
    }
})
