namespace Music_playlist_management.Helper
{
    using System.Security.Cryptography;
    using System.Text;

    public static class AesEncryptionHelper
    {
        private static readonly string Key = "0123456789abcdef"; // 16 characters
        private static readonly string IV = "abcdef9876543210";  // 16 characters

        public static string Decrypt(string encryptedText)
        {
            Console.WriteLine("Encrypted received: " + encryptedText);

            try
            {
                byte[] cipherBytes = Convert.FromBase64String(encryptedText);
                byte[] keyBytes = Encoding.UTF8.GetBytes(Key);
                byte[] ivBytes = Encoding.UTF8.GetBytes(IV);

                using Aes aes = Aes.Create();
                aes.Key = keyBytes;
                aes.IV = ivBytes;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using ICryptoTransform decryptor = aes.CreateDecryptor();
                byte[] plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
                return Encoding.UTF8.GetString(plainBytes);
            }
            catch (FormatException ex)
            {
                Console.WriteLine("Base64 format error: " + ex.Message);
                throw; // still rethrow for full stack trace
            }
        }

        public static string Encrypt(string plainText)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(Key);
            byte[] ivBytes = Encoding.UTF8.GetBytes(IV);
            byte[] inputBytes = Encoding.UTF8.GetBytes(plainText);

            using var aes = Aes.Create();
            aes.Key = keyBytes;
            aes.IV = ivBytes;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var encryptor = aes.CreateEncryptor();
            byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
            return Convert.ToBase64String(encryptedBytes);
        }
    }
}
