import { TAutoDeleteMode, TMessage, TUserMessage } from "../../types/chat";
import { MediaDeviceConfigType } from "../CallModal/types";

export type CallWindowProps = {
    config: MediaDeviceConfigType | null;
    finishCall: (isCaller: boolean) => void;
    chat: TUserMessage[];
    nickname: string;
    startAudioCalling: () => void;
    chatStatus: string;
    otherUserNickname: string;
    onOrigMessageDelete: (message: TUserMessage) => void;
    autoDeleteMode: TAutoDeleteMode | null;
    setAutoDeleteMode: (mode: TAutoDeleteMode | null) => void;
}

export type Theme = {
    theme: 'light' | 'dark';
} 