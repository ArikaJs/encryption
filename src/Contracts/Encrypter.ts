export interface Encrypter {
    /**
     * Encrypt the given value.
     */
    encrypt(value: any): string;

    /**
     * Decrypt the given value.
     */
    decrypt(payload: string): any;
    /**
     * Sign the given value.
     */
    sign(value: any): string;

    /**
     * Verify the given signed payload.
     */
    verify(payload: string): any;
}
