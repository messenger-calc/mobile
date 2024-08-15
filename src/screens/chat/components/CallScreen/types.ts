import WebRTCIssueDetector, { IssueDetectorResult, NetworkQualityStatsSample } from "webrtc-issue-detector";
import { MediaDeviceConfigType } from "../CallModal/types";
import { TNetworkScore } from "../../types/chat";

export type CallScreenProps = {
    peerNickname: string;
    onEndCall: () => void;
    remoteSrc: any;
    config: MediaDeviceConfigType,
    packetsLoss: number | undefined,
}