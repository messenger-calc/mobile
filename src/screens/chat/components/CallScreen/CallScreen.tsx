import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonIcon, ButtonQuestionMark, ButtonRow, Footer, Header, Row, Title } from './styled';
import { Svg } from '../../../../assets/icons';
import { CallScreenProps } from './types';
import { PeerConnectionContext } from '../../chat';
import { RTCView } from 'react-native-webrtc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EncryptAnimation } from '../EncryptAnimation/EncryptAnimation';

type TCallNetworkStatusBar = {
    packetLoss: number | undefined;
}

enum ENetworkPacketsLossColor {
    GOOD =  'green',
    NORNMAL = 'orange',
    BAD = 'red',
}

const CallNetworkStatusBar = ({ packetLoss } : TCallNetworkStatusBar) => {
    const [backgroundColor, setBackgroundColor] = useState<string>(ENetworkPacketsLossColor.GOOD);

    useEffect(() => {
        if (packetLoss !== undefined) {
            if (packetLoss <= 5) {
                setBackgroundColor(ENetworkPacketsLossColor.GOOD);
            }
            if (packetLoss > 5 && packetLoss < 20) {
                console.log('Oragnge!');
                setBackgroundColor(ENetworkPacketsLossColor.NORNMAL);
            }
            if (packetLoss >= 20) {
                setBackgroundColor(ENetworkPacketsLossColor.BAD);
            }
        }

        console.log('packetLoss:' , packetLoss);
        console.log('color:' , backgroundColor);
    }, [packetLoss]);

    useEffect(() => {
        if (backgroundColor === ENetworkPacketsLossColor.BAD) {
            Alert.alert('Втрата пакетів занадто висока, рекомендуємо закінчити дзвінок!');
        }
    }, [backgroundColor])

    return (
        <SafeAreaView style={{ margin: 0, padding: 0, alignItems: 'center', backgroundColor: backgroundColor }}>
            <StatusBar translucent backgroundColor={backgroundColor} barStyle={'light-content'} />
        </SafeAreaView>
    );
}

export const CallScreen = ({ peerNickname, onEndCall, remoteSrc, config, packetsLoss }: CallScreenProps) => {
    const remoteVideo = useRef<any>();
    const localVideo = useRef<any>();
    const [audio, setAudio] = useState(config?.audio);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [showSanta, setShowSanta] = useState<boolean>(false);
    const [isEncryption, setIsEncryption] = useState<boolean>(true);
    
    const { connection } = useContext(PeerConnectionContext);
    
    useEffect(() => {
        if (!isEncryption) {
            console.log('Call Screen!!')
            connection.mediaDevice.unmute('Audio');
            Vibration.vibrate([0.3, 0.3]);
        }
    }, [isEncryption]);

    useEffect(() => {
        if (remoteVideo.current && remoteSrc) {
            remoteVideo.current.srcObject = remoteSrc
        }
    }, [remoteSrc])
   
    useEffect(() => {
        isMuted
        ? connection.mediaDevice.unmute('Audio')
        : connection.mediaDevice.mute('Audio');
    }, [isMuted]);

    const onMuteToggle = () => {
        setIsMuted(!isMuted);
    }

    return isEncryption ? (
            <EncryptAnimation onDone={() => setIsEncryption(false)} />
        ) : (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                colors={['#6d6e70', '#383b42']}
                style={styles.linearGradient}>
            <RTCView streamURL={remoteSrc.toURL()} />
                
            <CallNetworkStatusBar packetLoss={packetsLoss} />

            <Header>
                <Row>
                    <ButtonQuestionMark onPress={() => Alert.alert('По всім питанням писати Діду Морозу!')}>
                        <Text style={{color: 'white'}}>?</Text>
                    </ButtonQuestionMark>
                </Row>
                <Row><Text style={{fontSize: 25, color: 'white'}}>Аудіодзвінок</Text></Row>
                <Row><Title>{peerNickname}</Title></Row>

            </Header>

            <Footer>
                <ButtonRow style={{ flex: 1, bottom: 0, marginBottom: 50 }}>
                    {/* End */}
                    <ButtonIcon isRed onPress={onEndCall}>
                        <Svg.PhoneDown fill={'white'} width={60} height={60}/>
                    </ButtonIcon>

                    {/* Mute */}
                    <ButtonIcon isDark={isMuted} onPress={onMuteToggle}>
                        <Svg.MicSlash fill={'white'} width={60} height={60}/>
                    </ButtonIcon>
                </ButtonRow>
            </Footer>

            </LinearGradient>
        )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
    },
});