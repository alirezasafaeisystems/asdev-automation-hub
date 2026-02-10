import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

function keyFromSeed(seed: string): Buffer {
  return createHash('sha256').update(seed).digest();
}

export class SecretCipher {
  constructor(private readonly seed: string) {}

  encrypt(plainText: string): string {
    const iv = randomBytes(12);
    const key = keyFromSeed(this.seed);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64url');
  }

  decrypt(payload: string): string {
    const packed = Buffer.from(payload, 'base64url');
    const iv = packed.subarray(0, 12);
    const tag = packed.subarray(12, 28);
    const body = packed.subarray(28);
    const key = keyFromSeed(this.seed);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
  }

  static mask(secret: string): string {
    if (secret.length <= 4) return '****';
    return `${secret.slice(0, 2)}***${secret.slice(-2)}`;
  }
}
