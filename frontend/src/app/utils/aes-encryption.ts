import * as CryptoJS from 'crypto-js';

// NOTE: These values must match your .NET backend exactly
const Key = '0123456789abcdef'; // 16 bytes (128-bit)
const iv = 'abcdef9876543210';  // 16 bytes IV

export function encryptAES(plainText: string): string {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(Key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    keyUtf8,
    {
      iv: ivUtf8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  // Convert to Base64 string
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
      }
