import { MediaDeviceConfigType } from "../CallModal/types";

export type MainWindowProps = {
    startCall: (isCaller: boolean, remoteId: string, config: MediaDeviceConfigType) => void,
    setNickname: (nickname: string) => void,
}