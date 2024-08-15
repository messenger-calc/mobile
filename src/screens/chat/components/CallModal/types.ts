export type MediaDeviceConfigType = {
    video: boolean;
    audio: boolean;
}

export type CallModalProps = {
    callFrom: string | null;
    startCall: (isCaller: boolean, remoteId: string, config: MediaDeviceConfigType) => void;
    rejectCall: () => void;
}