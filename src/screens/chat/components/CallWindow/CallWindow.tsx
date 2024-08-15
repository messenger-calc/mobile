import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, StyleSheet, Vibration, Appearance, SafeAreaView, View, Keyboard, Text, ScrollView, Button } from "react-native";
import { Svg } from "../../../../assets/icons";
import {
    ButtonIconBackward,
    ButtonIconCall,
    ButtonIconDisable,
    ButtonIconSend,
    Header,
    MainContainer,
    MessagesArea,
    RowContainer,
    StyledTextInput,
    TextInputArea,
    Title,
    Window
} from "./styled";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Sound from "react-native-sound"; ``
import { CallWindowProps } from './types';
import { Message } from './Chat/Message/Message';
import { ThemeProvider } from 'styled-components';
import { PeerConnectionContext } from '../../chat';
import uuid from 'react-native-uuid';
import { TMessageEnum, TUserMessage } from '../../types/chat';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { BlurView } from "@react-native-community/blur";

export const CallWindow = ({
    config,
    finishCall,
    chat,
    nickname,
    startAudioCalling,
    chatStatus,
    otherUserNickname,
    onOrigMessageDelete,
    autoDeleteMode,
    setAutoDeleteMode,
}: CallWindowProps) => {
    const messageScrollViewRef = createRef<ScrollView>();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const [newMessageText, setNewMessageText] = useState<string>('');
    const beepEndSoundRef = useRef<Sound>(null!);
    const [peerNickname, setPeerNickname] = useState<string>('');

    const [theme, setTheme] = useState<string>(Appearance.getColorScheme() || 'light');

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const { connection } = useContext(PeerConnectionContext);
    const navigation = useNavigation();

    connection?.mediaDevice.mute('Audio');
    useEffect(() => {
        // send internal message to hand over a nickname
        // connection?.mediaDevice.mute('Audio');
        //     console.log('User Nickname sended');
        //     connection?.sendMessage({ peerNickname: nickname, type: TMessageEnum.Internal } as TInternalMessage);   
        // connection?.listenInternalMessages((message: TInternalMessage) => {
        //     setPeerNickname(message.peerNickname);
        //     setPeerNicknameFunc(message.peerNickname);
        //     console.log('PeerNickname is -> ', message.peerNickname, "!!!");
        // });


        Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme || 'light');
        });

        Vibration.vibrate([0.3, 0.3]);
        // activateKeepAwake(); 
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        console.log('PeerNickname -> ', otherUserNickname);

        beepEndSoundRef.current = new Sound('end_beep.mp3', Sound.MAIN_BUNDLE, (err) => {
            if (err) {
                console.log('Failed to load the sound "end_beep.mp3". ', err);
            }

            beepEndSoundRef.current.setNumberOfLoops(1);
            beepEndSoundRef.current.setVolume(1);
            beepEndSoundRef.current.play((success) => {
                if (success) {
                    beepEndSoundRef.current.release();
                }
            })
        })
    }, [])

    const onHandleChange = (text: string) => {
        setNewMessageText(text);
    }

    useEffect(() => {
        console.log('IsKeyboardVisible: ', isKeyboardVisible);
        if (!isKeyboardVisible) {
            setNewMessageText('');
            messageScrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [isKeyboardVisible]);

    useEffect(() => {
        messageScrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chat])

    const onHandleSend = (e: GestureResponderEvent) => {
        if (!newMessageText) {
            return;
        }

        setNewMessageText('');
        Keyboard.dismiss();
        setNewMessageText('');
        const message = { text: newMessageText, from: nickname, type: TMessageEnum.User, uuid: uuid.v4().toString() };
        connection.sendMessage(message);
        chat.push(message as TUserMessage);

        // delete if autoDeleteMode is on
        if (autoDeleteMode) {
            setInterval(() => {
                onMessageDelete(message);
            }, autoDeleteMode.timeInMilliseconds);
        }

        messageScrollViewRef.current?.scrollToEnd({ animated: true });
    }

    const onHandleBackward = (event: GestureResponderEvent) => {
        navigation.goBack();
    }

    const handleScroll = (event: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

        // Calculate the current position
        const currentPosition = contentOffset.y + layoutMeasurement.height;

        // Calculate the maximum position (content size)
        const maximumPosition = contentSize.height;

        // Check if the current position is near the bottom
        const isNearBottom = maximumPosition - currentPosition < 33;

        setIsAtBottom(isNearBottom);
    };

    const onMessageDelete = (message: TUserMessage) => {
        onOrigMessageDelete(message);
    }

    const turnAutoDeleteModeOn = (time?: number) => {
        setIsModalVisible(false);
        if (!time) {
            setAutoDeleteMode(null);
            return;
        } 

        setAutoDeleteMode({
            state: true,
            timeInMilliseconds: time
        })

    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const openModal = () => {
        setIsModalVisible(true);
    }

    const formatMilliseconds = (milliseconds: number): string => {
        const seconds = milliseconds / 1000;
        if (seconds < 60) {
          return `${seconds}s`;
        } else {
          const minutes = seconds / 60;
          return `${minutes}m`;
        }
      };

    return (
        <ThemeProvider theme={{ main: theme }}>
            <View style={styles.container}>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={closeModal}
                    swipeDirection={['left', 'right']}
                    onSwipeComplete={closeModal}
                    style={{...styles.modal}}
                >
                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={10}
                        reducedTransparencyFallbackColor="white"
                    >
                        <Button title="5s" color={'#000'} onPress={() => turnAutoDeleteModeOn(5 * 1000)} />
                        <Button title="30s" color={'#000'} onPress={() => turnAutoDeleteModeOn(30 * 1000)} />
                        <Button title="1m" color={'#000'} onPress={() => turnAutoDeleteModeOn(1 * 60 * 1000)} />
                        <Button title="2m" color={'#000' } onPress={() => turnAutoDeleteModeOn(2 * 60 * 1000)} />
                        <Button title="5m" color={'#000'} onPress={() => turnAutoDeleteModeOn(5 * 60 * 1000)} />
                        <Button title="15m" color={'#000'} onPress={() => turnAutoDeleteModeOn(15 * 60 * 1000)} />
                        <Button title="30m" color={'#000'} onPress={() => turnAutoDeleteModeOn(30 * 60 * 1000)} />
                        <Button title="Зупинити" color={'red'} onPress={() => turnAutoDeleteModeOn()} />
                    </BlurView>
                </Modal>
            </View>
            <Window>
                <MainContainer>
                    <Header style={styles.headerBorderBottom}>
                        <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                autoDeleteMode && <ButtonIconDisable>
                                    <Text>{formatMilliseconds(autoDeleteMode.timeInMilliseconds)}</Text>
                                </ButtonIconDisable>
                            }
                            <ButtonIconBackward onPress={onHandleBackward}>
                                <Svg.Backward fill={theme === 'light' ? '#000' : '#fff'} />
                            </ButtonIconBackward>
                            <Title>{otherUserNickname}</Title>
                        </View>
                        {chatStatus && <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>{chatStatus}</Text>}
                    </Header>


                    <KeyboardAwareScrollView
                        scrollEnabled={false}
                        enableAutomaticScroll={true}
                        contentContainerStyle={{ flex: 1 }}
                        keyboardOpeningTime={1}
                        extraHeight={200}
                        keyboardShouldPersistTaps="handled">
                        <MessagesArea
                            ref={messageScrollViewRef}
                            scrollEventThrottle={16}
                            onScroll={handleScroll}>
                            {chat.map(message => {
                                return (
                                    <Message
                                        key={message.uuid}
                                        messageData={message}
                                        theme={theme}
                                        onDelete={onMessageDelete}
                                        nickname={nickname} />
                                )
                            })}
                        </MessagesArea>


                        <SafeAreaView >
                            <TextInputArea>
                                <RowContainer>
                                    <ButtonIconDisable
                                        onPress={() => {
                                            finishCall(true)
                                        }}>
                                        <Svg.PhoneDisable fill={'#fff'} width={13} height={13} />
                                    </ButtonIconDisable>
                                    <ButtonIconCall onPress={() => {
                                        startAudioCalling();
                                    }}>
                                        <Svg.Phone
                                            fill={theme === "light" ? '#000' : '#fff'}
                                            width={13}
                                            height={13} />
                                    </ButtonIconCall>
                                    <ButtonIconCall onPress={openModal}>
                                        <Svg.Timer
                                            width={13}
                                            height={13}
                                            fill={theme === 'light' ? '#000' : '#fff'}
                                        />
                                    </ButtonIconCall>
                                    <StyledTextInput
                                        placeholder="SMS"
                                        placeholderTextColor={
                                            theme === "light"
                                                ? 'rgba(0, 0, 0, 0.25)'
                                                : 'rgba(255, 255, 255, 0.25)'
                                        }
                                        onChangeText={onHandleChange}
                                        multiline={true}
                                        value={newMessageText} />
                                    <View>
                                        <ButtonIconSend style={{ ...styles.verifyButton, borderRadius: 13 }} onPress={onHandleSend}>
                                            <Svg.Send fill={'#000000'} />
                                        </ButtonIconSend>
                                    </View>
                                </RowContainer>
                            </TextInputArea>
                        </SafeAreaView>
                    </KeyboardAwareScrollView>
                </MainContainer>
            </Window>
        </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        height: 100,
        width: 300,
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
    },
    absolute: {
        // height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 10,
    },
    modal: {
        position: 'absolute',
        bottom: '-50%',
        right: 0,
        left: 0,
    },
    verifyButton: {
        position: 'absolute',
        alignSelf: 'center',
        right: 0,
    },
    headerBorderBottom: {
        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
        borderBottomWidth: 0.2,
    }
});
