import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Encrypter as EncrypterContract } from './Contracts/Encrypter';
import { DecryptionException } from './Exceptions/DecryptionException';

export class Encrypter implements EncrypterContract {
    private readonly key: Buffer;
    private readonly cipher = 'aes-256-gcm';

    constructor(key: string) {
        this.key = this.parseKey(key);

        if (this.key.length !== 32) {
            throw new Error('The encryption key must be 32 bytes.');
        }
    }

    /**
     * Parse the encryption key.
     */
    protected parseKey(key: string): Buffer {
        if (key.startsWith('base64:')) {
            return Buffer.from(key.substring(7), 'base64');
        }

        return Buffer.from(key);
    }

    /**
     * Encrypt the given value.
     */
    public encrypt(value: any): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.cipher, this.key, iv);

        const jsonValue = JSON.stringify(value);
        let encrypted = cipher.update(jsonValue, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const tag = cipher.getAuthTag();

        const payload = {
            iv: iv.toString('base64'),
            value: encrypted,
            tag: tag.toString('base64'),
        };

        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }

    /**
     * Decrypt the given value.
     */
    public decrypt(payload: string): any {
        const jsonPayload = this.getJsonPayload(payload);

        const iv = Buffer.from(jsonPayload.iv, 'base64');
        const tag = Buffer.from(jsonPayload.tag, 'base64');
        const value = jsonPayload.value;

        try {
            const decipher = createDecipheriv(this.cipher, this.key, iv);
            decipher.setAuthTag(tag);

            let decrypted = decipher.update(value, 'base64', 'utf8');
            decrypted += decipher.final('utf8');

            return JSON.parse(decrypted);
        } catch (error) {
            throw new DecryptionException();
        }
    }

    /**
     * Get the JSON payload from the given string.
     */
    protected getJsonPayload(payload: string): any {
        try {
            const decoded = Buffer.from(payload, 'base64').toString('utf8');
            const data = JSON.parse(decoded);

            if (!this.validPayload(data)) {
                throw new DecryptionException();
            }

            return data;
        } catch (error) {
            throw new DecryptionException();
        }
    }

    /**
     * Verify that the encryption payload is valid.
     */
    protected validPayload(payload: any): boolean {
        return typeof payload === 'object' &&
            payload !== null &&
            payload.iv &&
            payload.value &&
            payload.tag;
    }
}
