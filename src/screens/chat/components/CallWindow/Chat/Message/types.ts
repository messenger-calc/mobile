import { TUserMessage } from "../../../../types/chat";

export type MessageProps = {
    messageData: TUserMessage;
    theme: string; // 'light' | 'dark'
    nickname: string;
    onDelete: (message: TUserMessage) => void;
}

export type MessageType = {
    text: string;
    from: string;
    date?: Date;
}