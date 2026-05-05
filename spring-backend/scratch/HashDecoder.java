import java.nio.ByteBuffer;
import java.util.Base64;

public class HashDecoder {
    public static void main(String[] args) {
        String hash = "AQAAAAIAAYagAAAAEKxO6CTX5BfEJyH+cvq8mNPa0/1RFDD3mO1KHbs/TnzdNC7U2/q3rm7dVXpY4cKXuw==";
        byte[] decoded = Base64.getDecoder().decode(hash);
        
        ByteBuffer buffer = ByteBuffer.wrap(decoded);
        byte version = buffer.get();
        int prf = buffer.getInt();
        int iterCount = buffer.getInt();
        int saltLength = buffer.getInt();
        
        System.out.println("Version: " + version);
        System.out.println("PRF: " + prf);
        System.out.println("IterCount: " + iterCount);
        System.out.println("SaltLength: " + saltLength);
    }
}
