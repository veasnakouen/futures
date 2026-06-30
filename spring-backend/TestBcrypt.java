import org.springframework.security.crypto.bcrypt.BCrypt;
public class TestBcrypt {
    public static void main(String[] args) {
        String pw = "password123";
        String hash = BCrypt.hashpw(pw, BCrypt.gensalt());
        System.out.println("HASH: " + hash);
        System.out.println("MATCH: " + BCrypt.checkpw(pw, hash));
    }
}
