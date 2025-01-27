/**
 * Sample React Native Chat
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { REQUEST_TIMEOUT_MS } from "@env";

import PeerConnection from './utils/PeerConnection';
// import socket from './utils/socket';
import { StyleSheet, Text, View } from "react-native";
import Calling from "./components/Calling/Calling";
import { CallModal, CallWindow, MainWindow, Contacts } from "./components";
import randNickname from "./utils/randNickname";
import Security from "./utils/security";
import Sound from "react-native-sound";
import { TAutoDeleteMode, TInternalMessage, TUserMessage } from "./types/chat";
import { MediaDeviceConfigType } from './components/CallModal/types';
import { useNavigation } from '@react-navigation/native';
import { TChatContext, TPeerConnectionContext } from './types/types';
import { CallingScreen } from './components/CallingScreen/CallingScreen';
import { CallScreen } from './components/CallScreen/CallScreen';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import WebRTCIssueDetector, { EventType } from 'webrtc-issue-detector';
import { EncryptAnimation } from './components/EncryptAnimation/EncryptAnimation';
import { SocketContext } from './socket/SocketContext';

export const PeerConnectionContext = createContext<TPeerConnectionContext>({
    connection: {} as PeerConnection
})

export const ChatContext = createContext<TChatContext>({
    chat: {} as TUserMessage[]
})

export default function Chat() {
    const security = useRef<Security | null>(null);
    const socket = useContext(SocketContext);

    const [error, setError] = useState<string>('');

    const [connection, setConnection] = useState<boolean>(false);

    const [callFrom, setCallFrom] = useState<string>('');
    const [calling, setCalling] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);
    const [callWindow, setCallWindow] = useState(false);
    const [showCallingScreen, setShowCallingScreen] = useState<boolean>(false);
    const [showCallScreen, setShowCallScreen] = useState<boolean>(false);

    const [localSrc, setLocalSrc] = useState(null);
    const [remoteSrc, setRemoteSrc] = useState(null);

    const [pc, setPc] = useState<PeerConnection | null>(null);
    const [config, setConfig] = useState<MediaDeviceConfigType>({ video: false, audio: true });

    const [chat, setChat] = useState<TUserMessage[]>([]);
    const [nickname, setNickname] = useState<string>(randNickname());
    const [peerNickname, setPeerNickname] = useState<string | null>(null);
    const [chatStatus, setChatStatus] = useState<string>('');

    const [otherUserDeviceToken, setOtherUserDeviceToken] = useState<string>('');
    let deviceToken = '';

    const issueDetector = useRef<WebRTCIssueDetector | null>();
    const [packetsLoss, setPacketsLoss] = useState<number | undefined>(undefined);

    const [autoDeleteMode, setAutoDeleteMode] = useState<TAutoDeleteMode | null>(null);

    // const [sideRequestsIntervalId, setSideRequestsIntervalId] = useState<Timeout>(null!);

    const beepSoundRef = useRef<Sound>();

    const [encryptAnimation, setEncryptAnimation] = useState<boolean>(false);


    const setLocalDeviceToken = async () => {
        const token = await messaging().getToken();
        console.log('token -> ', token);
        deviceToken = token;
    }

    useEffect(() => {
        issueDetector.current?.eventEmitter.on(EventType.NetworkScoresUpdated, res => {
            setPacketsLoss(res.statsSamples.inboundStatsSample?.packetsLoss);
            socket.emit('packetLoss', { to: callFrom, networkType: 'networkScore', remoteLoss: res.statsSamples.inboundStatsSample?.packetsLoss });
        });
    }, [issueDetector.current]);

    useEffect(() => {
        setLocalDeviceToken();

        console.log('Chat.jsx UseEffect #1: socket request');
        socket.on('request', (data: any) => {
            console.log('request Payload: ', data)
            setCallFrom(data.from)
            setShowModal(true)
            setOtherUserDeviceToken(data.deviceToken);
            console.log('get otherDeeviceToken -> ', data.deviceToken);
            setTimeout(() => {
                if (!calling) {
                    setShowModal(false);
                }
            }, +REQUEST_TIMEOUT_MS)
        })
    }, [])

    useEffect(() => {
        // socket.on('encryptionPayload', (data) => {
        //     const bytes = crypto.AES.decrypt(data, TRANSFER_CRYPTO_PAYLOAD_KEY, { iv: TRANSFER_CRYPTO_PAYLOAD_IV });
        //     const payload = bytes.toString(crypto.enc.Utf8);
        //     security.current = new Security(payload?.secretKey, payload?.iv)
        socket.on('encryptionPayload', ({ secretKey, iv }: any) => {
            security.current = new Security(secretKey, iv)
        })
    });

    useEffect(() => {
        if (!pc) return
        console.log('Chat.jsx UseEffect #2: socket');

        socket
            .on('call', async (data: any) => {
                if (data.sdp) {
                    try {
                        console.log('SetRemoteDescription');
                        console.log('[INFO] setRemoteDescripion: ', data.sdp);
                        await pc.setRemoteDescription(data.sdp);
                    } catch (e) {
                        console.error('[ERROR]  -  ', e);
                    }


                    if (data.sdp.type === 'offer') {
                        console.log('Create offer');
                        pc.createAnswer()
                    }
                } else {
                    console.log('Create candidate');
                    await pc.addIceCandidate(data.candidate)
                }
            })
            .on('end', () => finishCall(false))
        console.log('End UseEffect #2')
    }, [pc])

    useEffect(() => {
        socket.on('voiceCallStart', (data: any) => {
            console.log('Start audio call fromm another peer!');
            setShowCallingScreen(true);
        })
            .on('voiceCallReject', (data: any) => {
                console.log('Audio Calling Rejected!')
                setChatStatus('Користувач відхилив виклик!');
                setTimeout(() => {
                    setChatStatus('');
                }, 5000);
            })
            .on('voiceCallSuccess', (data: any) => {
                console.log('Start Call');
                setShowCallScreen(true);
                setEncryptAnimation(true);
            })
            .on('voiceCallEnd', (data: any) => {
                setShowCallScreen(false);
            })
            .on('send', (data: any) => {
                if (!peerNickname) {
                    setPeerNickname(data.nickname);
                    setOtherUserDeviceToken(data.deviceToken)
                    if (otherUserDeviceToken === '') {
                        socket.emit('send', { to: data.from, nickname, deviceToken });
                    }
                }
            })
            .on('packetLoss', (data: any) => {
                if (data.networkType === 'networkScore') {
                    console.log('data.packetsLoss', data.remoteLoss);
                    setPacketsLoss(data.remoteLoss);
                }
            })
            .on('deleteMessage', (data: any) => {
                console.log('Asking for deleting message! => ', data.message);
                setChat(arr => arr.filter(mes => mes.uuid !== data.message.uuid));
            })
    }, []);

    useEffect(() => {
        if (showCallingScreen) {
            axios.get('https://msg-calc-back-409f2da36884.herokuapp.com/sendPushNotification').catch(err => console.log(err.message));
        }
    }, [showCallingScreen])

    useEffect(() => {
        if (autoDeleteMode) {
            console.log('Auto delete mode is turn on =>', autoDeleteMode);
        }
    }, [autoDeleteMode]);

    // const genRandString = (length: number) => {
    //     let result = '';
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     while (result.length < length) {
    //         result += characters.charAt(Math.floor(Math.random() * characters.length));
    //     }
    //     return result;
    // }

    // const sideRequests = async () => {
    //     fetch(TELEGRAM_BOT_URL_1, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             text: genRandString(10)
    //         })
    //     })
    //     fetch(TELEGRAM_BOT_URL_2, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             text: genRandString(10)
    //         })
    //     })
    //     fetch(VIBER_BOT_URL, {
    //         method: 'POST',
    //         body: {
    //             // @ts-ignore
    //             receiver: "01234567890A=",
    //             min_api_version: 1,
    //             sender: {
    //                 name: "John McClane",
    //                 avatar: "https://avatar.example.com"
    //             },
    //             tracking_data: "tracking data",
    //             type: "text",
    //         }
    //     })
    // }

    // const stopSideRequests = () => {
    //     clearInterval(sideRequestsIntervalId);
    // }

    const startCall = (isCaller: boolean, remoteId: string, config: MediaDeviceConfigType) => {
        setTimeout(() => {
            if (!connection) {
                setCalling(false);
            }
        }, +REQUEST_TIMEOUT_MS)

        // const intervalId = setInterval(() => sideRequests(), 1000);
        // setSideRequestsIntervalId(intervalId);

        // pass nickname 
        console.log('SEND NICKNAME!');
        socket.emit('send', { to: callFrom, nickname, deviceToken });

        setError('');
        setShowModal(false)
        setCalling(true)
        setConfig(config)

        if (isCaller) {
            security.current = new Security();
            const payload = {
                to: remoteId,
                secretKey: security.current?.secretKey,
                iv: security.current?.iv
            }
            socket.emit('encryptionPayload', payload)
            // crypto.AES.encrypt((JSON.stringify(payload)), TRANSFER_CRYPTO_PAYLOAD_KEY, { iv: TRANSFER_CRYPTO_PAYLOAD_IV }).toString()
        }

        issueDetector.current = new WebRTCIssueDetector({});
        const _pc = new PeerConnection(remoteId, security.current!)
            .on('localStream', (stream: any) => {
                setLocalSrc(stream)
            })
            .on('remoteStream', (stream: any) => {
                setConnection(true);
                setRemoteSrc(stream)
                setCallWindow(true);
                setCalling(false)
            })
            .start(isCaller, { audio: true, video: false } as MediaDeviceConfigType);

        _pc.listenMessages(onMessageReceive);
        setPc(_pc);
        setCallFrom(remoteId);
        _pc?.pc?.addEventListener('iceconnectionstatechange', event => {
            switch (_pc?.pc?.iceConnectionState) {
                case 'completed':
                    console.log('[INFO]: Connection completed #2!');
                    // start detector
                    issueDetector.current?.watchNewPeerConnections();
                    issueDetector.current?.handleNewPeerConnection(_pc.pc);

                    break;
                case 'failed':
                    // end detector
                    issueDetector.current?.stopWatchingNewPeerConnections();

                    break;
                case 'disconnected':
                    // end detector
                    issueDetector.current?.stopWatchingNewPeerConnections();

                    break;
                case 'closed':
                    // end detector
                    issueDetector.current?.stopWatchingNewPeerConnections();

                    break;
            }
        })

        console.log('Request timeout => ', REQUEST_TIMEOUT_MS);

    }

    const finishCall = (isCaller: boolean) => {
        console.log('[INFO] Finish Call');

        setCallWindow(false);

        pc?.stop(isCaller)
        // stopSideRequests();
        setConnection(false)

        security.current = null;

        setPc(null)

        setCalling(false)
        setShowModal(false)

        setLocalSrc(null)
        setRemoteSrc(null)

        setChat([]);
    }

    const rejectCall = () => {
        socket.emit('end', { to: callFrom })

        setShowModal(false);
    }

    const onMessageReceive = (newMessage: TUserMessage) => {
        setChat(prevState => [...prevState, newMessage]);
    }

    const startBeep = () => {
        Sound.setCategory('Playback');

        beepSoundRef.current = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (err) => {
            if (err) {
                console.log('Failed to load the sound "beep.mp3". ', err);
            }

            beepSoundRef.current?.setVolume(0.5);
            beepSoundRef.current?.setSpeakerphoneOn(true);
            beepSoundRef.current?.setNumberOfLoops(-1);
            beepSoundRef.current?.play();
        })
    }

    const stopBeep = () => {
        console.log('Stop beep!')
        beepSoundRef.current?.release();
    }

    const startRingtone = () => {
        // TODO: make tingtone
    }

    const stopRingtone = () => {
        // TODO: make tingtone
    }

    const onCallingReject = () => {
        console.log('Reject!');
        setShowCallingScreen(false);
        stopRingtone();

        console.log('From -> ', callFrom);
        socket.emit('voiceCallReject', { to: callFrom });
    }

    const onCallingSuccess = () => {
        socket.emit('voiceCallSuccess', { to: callFrom });
        setShowCallingScreen(false);
        setShowCallScreen(true);
        setEncryptAnimation(true);
        stopRingtone();
    }

    const onStartCallig = () => {
        // send notification
        axios.post('https://fcm.googleapis.com/fcm/send', {
            to: otherUserDeviceToken,
            notification: {
                "title": "Калькулятор",
                "body": "!!!",
                "mutable_content": true,
                "sound": "Tri-tone"
            }
        },
            {
                headers: {
                    'Authorization': 'key=AAAAPzCbeHE:APA91bGT7SHI7HQZbQGK29znrqk9xNfEwaftALwqOLVY4oL-J2KAk_REy-rVkXYioBDXMV_KyTLFDEZv9t3NrSH55jbo2gsxk8R9FECU6j3IrbzEO49AEwC0J3U_Ce3xKT3M_Bwn0eg5',
                }
            }).catch(res => console.log(res)).catch(err => console.log(err));

        console.log('Start audio call to -> ', callFrom);
        socket.emit('voiceCallStart', { nickname, to: callFrom });
        setChatStatus('Дзвінок');
        setTimeout(() => {
            setChatStatus('');
        }, 100000);
    }

    const onAudicallEnd = () => {
        setShowCallScreen(false);
        socket.emit('voiceCallEnd', { to: callFrom });
    }

    const onMessageDelete = (message: TUserMessage) => {
        socket.emit('deleteMessage', { to: callFrom, message });
        console.log('Delete message local and send signal to delete on other peer');
        setChat(arr => arr.filter(mes => mes.uuid !== message.uuid));
    }

    return (
        // <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        //     colors={['#6d6e70', '#383b42']}
        //     style={styles.linearGradient}>
        // 1e1e1e
        <View style={{ ...styles.linearGradient, backgroundColor: "#000" }}>
            <View style={styles.app}>
                {/* <Text style={styles.appTitle}>Мессенджер</Text> */}
                <Text style={styles.appError}>{error}</Text>
                <Contacts startCall={startCall} setNickname={setNickname}/>
                {/* <MainWindow startCall={startCall} setNickname={setNickname} /> */}
                {calling &&
                    <Calling startBeep={startBeep} />}
                {showModal && (
                    <CallModal
                        callFrom={callFrom}
                        startCall={startCall}
                        rejectCall={rejectCall}
                    />
                )}
                <PeerConnectionContext.Provider value={{ connection: pc! }}>
                    {(callWindow) && (
                        <CallWindow
                            config={config}
                            onOrigMessageDelete={onMessageDelete}
                            finishCall={finishCall}
                            chat={chat}
                            nickname={nickname}
                            startAudioCalling={onStartCallig}
                            chatStatus={chatStatus}
                            otherUserNickname={peerNickname!}
                            autoDeleteMode={autoDeleteMode}
                            setAutoDeleteMode={setAutoDeleteMode}
                        />

                    )}
                    {(showCallScreen) && (
                        <CallScreen
                            peerNickname={peerNickname!}
                            onEndCall={onAudicallEnd}
                            remoteSrc={remoteSrc}
                            config={config}
                            packetsLoss={packetsLoss}
                        />
                    )}
                    {showCallingScreen && (
                        <CallingScreen
                            peerNickname={peerNickname!}
                            onReject={onCallingReject}
                            onSuccess={onCallingSuccess} />
                    )}
                </PeerConnectionContext.Provider>
            </View>
        </View>
        // {/* </LinearGradient> */}
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    app: {
        flex: 1,
        color: "white",
        flexDirection: "column",
        display: "flex",
    },
    appTitle: {
        color: "white",
        fontSize: 35,
        position: 'absolute',
        fontWeight: "700",
        top: 50,
    },
    appError: {
        color: "#6e0b00",
        position: 'absolute',
        fontSize: 25,
        top: 100,
    },
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
    mainWindow: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});
