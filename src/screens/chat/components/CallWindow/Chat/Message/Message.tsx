import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { MessageProps } from "./types";
import { ThemeProvider } from "styled-components";
import { MessageText, MyMessage, OtherMessage } from "./style";
import Modal from 'react-native-modal';
import { BlurView } from "@react-native-community/blur";

export const Message = ({ messageData, theme, nickname, onDelete }: MessageProps) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleLongPress = () => {
        Vibration.vibrate(1);
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (
        <ThemeProvider theme={{ main: theme }}>
            {
                messageData.from === nickname ? <>
                    <TouchableOpacity onLongPress={handleLongPress}>
                        <MyMessage key={Math.random() * 1000}>
                            <MessageText messageType="my">{messageData.text}</MessageText>
                        </MyMessage>
                    </TouchableOpacity>
                    <Modal 
                        isVisible={isModalVisible} 
                        onBackdropPress={closeModal} 
                        swipeDirection={['left', 'right']}                      
                        onSwipeComplete={closeModal}
                        style={styles.modal}
                        >
                        <BlurView 
                            style={styles.absolute}
                            blurType="light"
                            blurAmount={10}
                            reducedTransparencyFallbackColor="white"
                        >
                            <Button title="Delete" color={'red'} onPress={() => onDelete(messageData)}/>
                        </BlurView>
                    </Modal>
                </>
                :
                <OtherMessage key={Math.random() * 1000}>
                    <MessageText>{messageData.text}</MessageText>
                </OtherMessage>
            }
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    absolute: {
        // height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 10,
    },
    modal: {
        position: 'absolute',
        bottom: '-75%',
        right: 0,
        left: 0,
    },
    option: {
        fontSize: 18,
        color: 'black',
        padding: 10,
    },
});