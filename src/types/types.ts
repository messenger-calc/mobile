import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PeerConnection from "../utils/PeerConnection";
import { TUserMessage } from "./chat";

export type ChatHomeScreenProps = NativeStackScreenProps<any, "Home">;
export type ChatScreenProps = NativeStackScreenProps<any, "Chat">;
export type CallingScreenProps = NativeStackScreenProps<any, "Calling">;
export type CallScreenProps = NativeStackScreenProps<any, "Call">;

export type TPeerConnectionContext = {
  connection: PeerConnection;
};

export type TChatContext = {
  chat: TUserMessage[];
};
