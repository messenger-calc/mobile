import Emitter from './Emitter'
import {mediaDevices} from "react-native-webrtc";

class MediaDevice extends Emitter {
    public stream: any;


    start() {
        mediaDevices
            .getUserMedia({
                audio: true,
                video: false
            })
            .then((stream) => {

                this.stream = stream
                this.emit('stream', stream)
            })
            .catch(console.error)

        console.log('[INFO] start');

        return this
    }

    toggle(type: any, on: any) {
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((t: any) => {
                t.enabled = on ? on : !t.enabled
            })
        }

        return this;
    };

    unmute(type: string) {
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((t: any) => {
                t.enabled = true;
            })
        }

        return this;
    }

    mute(type: string) {
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((t: any) => {
                t.enabled = false
            })
        }

        return this;
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach((t: any) => {
                t.stop()
            })
        }
        console.log('[INFO] stop');
        return this
    }
}

export default MediaDevice