import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.Base64;

public class PasswordTester {
    public static void main(String[] args) throws Exception {
        String password = "Admin@123";
        String encodedHash = "AQAAAAIAAYagAAAAEKxO6CTX5BfEJyH+cvq8mNPa0/1RFDD3mO1KHbs/TnzdNC7U2/q3rm7dVXpY4cKXuw==";

        byte[] decodedHash = Base64.getDecoder().decode(encodedHash);
        ByteBuffer buffer = ByteBuffer.wrap(decodedHash);
        buffer.get(); // skip version
        int prf = buffer.getInt();
        int iterCount = buffer.getInt();
        int saltLength = buffer.getInt();

        byte[] salt = new byte[saltLength];
        buffer.get(salt);

        int subkeyLength = decodedHash.length - 13 - saltLength;
        byte[] storedSubkey = new byte[subkeyLength];
        buffer.get(storedSubkey);

        String algorithm = (prf == 2) ? "PBKDF2WithHmacSHA512" : "PBKDF2WithHmacSHA256";

        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterCount, subkeyLength * 8);
        SecretKeyFactory factory = SecretKeyFactory.getInstance(algorithm);
        byte[] testSubkey = factory.generateSecret(spec).getEncoded();

        boolean matches = MessageDigest.isEqual(storedSubkey, testSubkey);
        System.out.println("Password Matches: " + matches);
    }
}
