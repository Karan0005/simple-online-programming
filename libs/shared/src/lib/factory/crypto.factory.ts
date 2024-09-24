import CryptoJS from 'crypto-js';

export const CryptoFactory = {
    Encrypt: (secretKey: string, decodedValue: string): string => {
        return CryptoJS.AES.encrypt(decodedValue, secretKey).toString();
    },
    Decrypt: (secretKey: string, encodedValue: string): string => {
        return CryptoJS.AES.decrypt(encodedValue, secretKey).toString(CryptoJS.enc.Utf8);
    }
};
