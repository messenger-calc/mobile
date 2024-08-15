import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, StyleSheet, Text, View } from "react-native"
import { MainContainer } from "./styles"
import LottieView from "lottie-react-native"
import { AnimationLottie } from "../../../../assets/lottie"
import { SoundService } from "../../../../common/SoundService"
import { Loading } from "../../../../common/Loading"
import { TEncryptAnimationProps } from "./types"

export const EncryptAnimation = ({ onDone }: TEncryptAnimationProps) => {
    return (
        <MainContainer>
            <Spinner onDone={onDone}/>
        </MainContainer>
    )
}

const height = 200;
const spinnerColor = '#28ed49';
const Spinner = ({ onDone }: {onDone: () => void}) => {
    const scale = useRef(new Animated.Value(1)).current; 
    const [success, setSuccess] = useState(false);
    const [sound] = useState(SoundService.playSoundConfirm());
    const [animationDuration] = useState<number>(randomIntFromInterval(2000, 4000));

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(scale, {
                toValue: 0,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => setSuccess(true));
        }, animationDuration);
    }, [scale]);

    useEffect(() => {
        if (success) {
            sound.play(() => sound.release());
            Animated.timing(scale, {
                toValue: 1,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
        }
    }, [success]);

    function randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

    return (
        <View style={styles.container} >
            <View style={styles.textContainer}>
                <Loading text="Встановлення безпечного шифрування" />
            </View>
            <Animated.View
                style={[
                    styles.spinner, 
                    { transform: [{ scale: scale }] }
                ]}>
                {
                    success 
                    ? <LottieView  
                        source={AnimationLottie.CheckmarkSuccess} 
                        autoPlay 
                        loop={false} 
                        onAnimationFinish={onDone}
                        style={styles.animation} />
                    : <LottieView 
                        source={AnimationLottie.LoadingWave} 
                        autoPlay 
                        loop={true} 
                        style={styles.animation} />
                }
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: '100%',
        height: 200,
    },
    animation: {
        width: 200,
        height: 200,
    },
    textContainer: {
        position: 'absolute',
        width: '100%',
        top: 200,
        alignItems: 'center',
    }
})