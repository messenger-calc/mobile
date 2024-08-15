import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {ButtonIconCalling} from "./styled";
import { Svg } from '../../../../assets/icons';
import { CallingProps } from './types';

const Calling = ({ startBeep }: CallingProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        console.log('Start calling component');

        startBeep();

        Animated
            .loop(
                Animated.sequence([
                   Animated.timing(scaleAnim, {
                       toValue: 1.2,
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

    return (
        <View style={styles.calling}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }]}}>
                <ButtonIconCalling style={styles.appButton} disabled={true}>
                    <Svg.Smartphone fill={'#fff'} height={38} width={38}/>
                </ButtonIconCalling>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    appButton: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 3,
    },
    calling: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
})

export default Calling;
