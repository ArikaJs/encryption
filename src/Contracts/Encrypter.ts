export interface Encrypter {
    /**
     * Encrypt the given value.
     */
    encrypt(value: any): string;

    /**
     * Decrypt the given value.
     */
    decrypt(payload: string): any;
}
