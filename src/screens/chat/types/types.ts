import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamList } from "../../../common/types";
import PeerConnection from "../utils/PeerConnection";
import { TUserMessage } from "./chat";

export type ChatHomeScreenProps = NativeStackScreenProps<ChatStackParamList, "Home">
export type ChatScreenProps = NativeStackScreenProps<ChatStackParamList, "Chat">
export type CallingScreenProps = NativeStackScreenProps<ChatStackParamList, "Calling">
export type CallScreenProps = NativeStackScreenProps<ChatStackParamList, "Call">

export type TPeerConnectionContext = {
    connection: PeerConnection
}

export type TChatContext = {
    chat: TUserMessage[];
}