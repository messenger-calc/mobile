import Sound from "react-native-sound";

export type SoundType = 'notificaton' | 'beep';
export class SoundService {
    public static playSoundConfirm() {
        Sound.setCategory('Playback');

        return new Sound('confirmation-sound.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound ', error);
                return;
            }
        });
    }
}