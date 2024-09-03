import Emitter from "./Emitter";
import MediaDevice from "./MediaDevice";
import socket from "./socket";
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import Security from "./security";
import {
  TInternalMessage,
  TMessage,
  TMessageEnum,
  TUserMessage,
} from "../types/chat";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";
//import {MediaDeviceConfigType} from '../components/CallModal/types';

const CONFIG = {
  iceServers: [
    {
      urls: "stun:stun1.l.google.com:19302",
    },
    {
      urls: "stun:stun2.l.google.com:19302",
    },
    {
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      credential: "tE2DajzSJwnsSbc123",
    },
  ],
};

class PeerConnection extends Emitter {
  remoteId: string;
  security: Security;
  pc: RTCPeerConnection | null;
  channel: RTCDataChannel | null;
  mediaDevice: MediaDevice;
  deviceToken: string | null;

  logTurnCredentials() {
    console.log("urls: , 132");
    console.log("username: 1231, ");
    console.log("credential: , 21312");
  }

  constructor(remoteId: string, security: Security) {
    super();
    this.remoteId = remoteId;
    this.security = security;
    this.channel = null;
    this.deviceToken = "";

    this.logTurnCredentials();
    this.pc = new RTCPeerConnection(CONFIG);
    this.pc.addEventListener("icecandidate", (event) => {
      console.log("EVENT TYPE => ", event.type);
      socket.emit("call", {
        to: this.remoteId,
        candidate: event.candidate,
      });
    });
    this.pc.addEventListener("track", (event) => {
      this.emit("remoteStream", event.streams[0]);
    });
    this.mediaDevice = new MediaDevice();
    this.getDescription = this.getDescription.bind(this);
  }

  start(isCaller: boolean, config: any) {
    this.createChannel();
    this.mediaDevice
      .on("stream", (stream: any) => {
        stream.getTracks().forEach((t: any) => {
          this.pc?.addTrack(t, stream);
        });

        this.emit("localStream", stream);

        isCaller
          ? socket.emit("request", { to: this.remoteId })
          : this.createOffer();
      })
      .start();
    return this;
  }

  stop(isCaller: boolean) {
    if (isCaller) {
      socket.emit("end", { to: this.remoteId });
    }

    this.mediaDevice.stop();

    try {
      this.pc?.restartIce();
      this.pc?.close();
    } catch (e) {
      console.error(e);
    }
    this.pc = null;
    return this;
  }

  createOffer() {
    this.pc
      ?.createOffer({
        iceRestart: true,
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      })
      .then(this.getDescription)
      .catch(console.error);

    return this;
  }

  createAnswer() {
    try {
      this.pc?.createAnswer().then(this.getDescription).catch(console.error);
    } catch (e) {
      console.log(e);
    }

    return this;
  }

  async getDescription(desc: RTCSessionDescription) {
    try {
      await this.pc?.setLocalDescription(desc);

      socket.emit("call", { to: this.remoteId, sdp: desc });
    } catch (e) {
      console.error(e);
    }

    return this;
  }

  createChannel() {
    try {
      this.channel = this.pc?.createDataChannel("channel") || null;
      this.channel?.addEventListener("close", (event) => {
        console.log("[INFO] Data channel closed");
      });
      this.channel?.addEventListener("open", (event) => {
        console.log("[INFO] Data channel opened!");
      });
    } catch (e) {
      console.error("[ERROR Fail to create a data channel: ", e);
    }
  }

  /**
   * Listen messages and if any accurs - call a <cb> from params and pass new message to it.
   *
   * @param cb - a callback that will be called when any new message occures
   * @returns void
   *
   */
  listenMessages(cb: any) {
    try {
      this.pc?.addEventListener("datachannel", (event: any) => {
        const channel = event.channel;
        channel.addEventListener("message", (data: any) => {
          console.log("newMessage !!!! => ", data);
          const res: TMessage = JSON.parse(
            this.security.decryptObject(data.data)
          ) as TMessage;
          if (res.type === TMessageEnum.User) {
            cb(res as TUserMessage);
          }
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  listenInternalMessages(cb: (message: TInternalMessage) => void): void {
    try {
      this.pc?.addEventListener("datachannel", (event: any) => {
        const channel = event.channel;
        channel.addEventListener("message", (data: any) => {
          const res: TMessage = JSON.parse(
            this.security.decryptObject(data.data)
          ) as TMessage;
          // TODO: Remove ToSting() in prod
          if (res.type === TMessageEnum.Internal) {
            cb(res as TInternalMessage);
          }
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Send <Message> to another peer
   *
   * @param message - a Message object that will be sended to another peer
   * @returns void
   *
   */
  sendMessage(message: any) {
    this.channel?.send(this.security.encryptObject(JSON.stringify(message)));
  }

  async setRemoteDescription(desc: RTCSessionDescription) {
    try {
      await this.pc?.setRemoteDescription(new RTCSessionDescription(desc));
    } catch (e) {
      console.log(e);
    }

    return this;
  }

  async addIceCandidate(candidate: RTCIceCandidate) {
    if (candidate) {
      try {
        await this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.log("[ERROR] ", e);
      }
    }

    return this;
  }
}

export default PeerConnection;
