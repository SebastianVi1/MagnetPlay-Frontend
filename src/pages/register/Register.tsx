import styles from "./Register.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import abstractBg from "../../assets/bg_register.jpg";
import { useAuth } from "../../hooks/useAuth"; //
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth(); //  Use signUp from auth context

  const handleOnClickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting registration with:", { username, email, password: "***" });
      
      //Call signUp function from auth context
      await signUp({ username, email, password });
      console.log("Registration successful");
    } catch (err) {
      console.error("Registration error in component:", err);
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h3>Create Account</h3>
          <form onSubmit={handleOnClickRegister}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              className={styles.inputP}
              type="text" // Changed from email to text for username
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Fixed onChange handler
              placeholder="Username"
              required
            />
            <input
              className={styles.inputP}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className={styles.inputPassword}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <Button
              variant="primary"
              className={styles.buttonLogin}
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <p className={styles.registerP}>You already have an account?</p>
          <Link to={"/login"}>Login here</Link>
        </div>
        <div className={styles.imageContainer}>
          <img src={abstractBg} alt="Logo image" />
        </div>
      </div>
    </div>
  );
}

export default Register;
