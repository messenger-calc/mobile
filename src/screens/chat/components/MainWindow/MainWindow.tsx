import React, { useEffect, useRef, useState } from 'react'

import socket from '../../utils/socket'

import { Alert, AppState, Clipboard, DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    MainWindowButtonIcon,
    MainWindowButtonText,
    MainWindowError,
    MainWindowLocalId,
    MainWindowLocalIdText,
    MainWindowRemoteId,
    MainWindowTextInput,
    MainWindowTitle,
    MainWindowView,
    RowContainer,
    ShowButton,
} from "./styled";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Svg} from "../../../../assets/icons";
import { MainWindowProps } from './types';

export const MainWindow = ({ startCall, setNickname }: MainWindowProps) => {
    const [remoteId, setRemoteId] = useState('');
    const [localId, setLocalId] = useState('');
    const [localIdShow, setLocalIdShow] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('useEffect');
        console.log('Init Socket signal');
        socket
            .on('init', ({ id }) => {
                setLocalId(id);
            })
            .emit('init');
    }, [])

    const callWithVideo = (video: boolean) => {
        if (!remoteId.trim() || remoteId.length < 5) {
            return setError('ID друга недійсний!');
        }

        if (localId === remoteId) {
            return setError("Ви не можете подзвонити до себе!");
        }

        const config = { audio: true, video: false }
        startCall(true, remoteId, config);
    }

    const onLocalIdPress = () => {
        Clipboard.setString(localId);
        setLocalIdShow(!localIdShow);
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1, top: 200}} extraHeight={125}>
            <MainWindowView style={{flex: 1}}>
                <MainWindowLocalId>
                    <MainWindowTitle>Ваш ID</MainWindowTitle>
                    <RowContainer>
                    {
                        localIdShow
                            ? <>
                                <TouchableOpacity onPress={onLocalIdPress}>
                                    <MainWindowLocalIdText style={styles.localIdUnderline}>{localId}</MainWindowLocalIdText>
                                </TouchableOpacity>
                                <Text style={{color: 'white', position: 'absolute', right: 0}}>{'\u2190'} Натисніть!</Text>
                            </>
                            :
                            <ShowButton onPress={() => setLocalIdShow(!localIdShow)}>
                                <Text style={{ color: "#f1f1f1", fontSize: 18, fontWeight: "bold" }}>Показати</Text>
                            </ShowButton>
                    }
                    </RowContainer>
                </MainWindowLocalId>
                <MainWindowRemoteId>
                    <MainWindowTextInput
                        spellCheck={false}
                        autoCorrect={false}
                        placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                        placeholder='Введіть ID вашого друга'
                        style={styles.textInputShadow}
                        maxLength={5}
                        onChangeText={(newText: string) => {
                            setError('')
                            setRemoteId(newText)
                        }}/>
                    <MainWindowError>{error}</MainWindowError>

                    <View style={styles.separator}/>

                    <View>
                        <MainWindowButtonIcon style={styles.buttonShadow} onPress={() => callWithVideo(false)}>
                            <Svg.Smartphone fill={'#e0e0e0'} width={30} height={30}/>
                        </MainWindowButtonIcon>
                    </View>
                </MainWindowRemoteId>
            </MainWindowView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
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
    localIdUnderline: {
        borderStyle: 'dashed',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    separator: {
        height: 1,
        width: 300,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    textInputShadow: {
        shadowColor: 'rgba(0, 0, 0, 255)',
    shadowOffset: {
      width: 0,
      height: -3
    },
    shadowRadius: 3,
    shadowOpacity: 1
    }
});