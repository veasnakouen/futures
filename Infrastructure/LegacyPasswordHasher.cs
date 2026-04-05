using Microsoft.AspNetCore.Identity;
using MtpApp.Models;
using System;
using System.Security.Cryptography;

namespace MtpApp.Infrastructure
{
    /// <summary>
    /// Supports verifying passwords hashed by the old ASP.NET Identity v2 (.NET Framework)
    /// format alongside the current ASP.NET Core Identity v3 format.
    /// Old format: 0x00 | 16-byte salt | PBKDF2-HMACSHA1(password, salt, 1000 iters, 32 bytes)
    /// </summary>
    public class LegacyPasswordHasher : IPasswordHasher<ApplicationUser>
    {
        private readonly PasswordHasher<ApplicationUser> _v3Hasher = new();

        public string HashPassword(ApplicationUser user, string password)
            => _v3Hasher.HashPassword(user, password);

        public PasswordVerificationResult VerifyHashedPassword(
            ApplicationUser user, string hashedPassword, string providedPassword)
        {
            // Try current v3 format first.
            var result = _v3Hasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
            if (result != PasswordVerificationResult.Failed)
                return result;

            // Fall back to old ASP.NET Identity v2 format.
            if (VerifyLegacyV2Password(hashedPassword, providedPassword))
                return PasswordVerificationResult.SuccessRehashNeeded; // triggers an automatic rehash to v3

            return PasswordVerificationResult.Failed;
        }

        private static bool VerifyLegacyV2Password(string hashedPassword, string providedPassword)
        {
            byte[] decoded;
            try { decoded = Convert.FromBase64String(hashedPassword); }
            catch { return false; }

            // v2 layout: [0x00][16-byte salt][32-byte PBKDF2-SHA1 subkey] = 49 bytes total
            if (decoded.Length != 49 || decoded[0] != 0x00)
                return false;

            byte[] salt = new byte[16];
            Buffer.BlockCopy(decoded, 1, salt, 0, 16);

            byte[] expectedSubkey = new byte[32];
            Buffer.BlockCopy(decoded, 17, expectedSubkey, 0, 32);

            byte[] actualSubkey;
            try
            {
            #pragma warning disable CA5379 // SHA1 required for legacy compat
                using var deriveBytes = new Rfc2898DeriveBytes(providedPassword, salt, 1000, HashAlgorithmName.SHA1);
            #pragma warning restore CA5379
                actualSubkey = deriveBytes.GetBytes(32);
            }
            catch { return false; }

            return CryptographicOperations.FixedTimeEquals(actualSubkey, expectedSubkey);
        }
    }
}
