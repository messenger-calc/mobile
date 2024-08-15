import crypto from 'react-native-crypto-js';

export default class Security {
    public secretKey: string;
    public iv: crypto.lib.WordArray;

    constructor(secretKey?: string, iv?: crypto.lib.WordArray) {
        this.secretKey = secretKey ? secretKey : this.genRandString(32).toString();
        this.iv = iv ? iv : this.genRandString(32);
    }

    genRandString(bytes = 128) {
        return crypto.lib.WordArray.random(bytes);
    }

    encryptObject(payload: any) {
        return crypto.AES.encrypt(payload, this.secretKey, { iv: this.iv }).toString();
    }

    decryptObject(payload: any) {
        const bytes = crypto.AES.decrypt(payload, this.secretKey, { iv: this.iv });
        return bytes.toString(crypto.enc.Utf8);
    }
}