import styles from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/bg-login.jpg";
import Button from "react-bootstrap/Button";
import googleLogo from "../../assets/google_logo.jpg";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { signIn, state } = useAuth();

  // oauth2 google
  const handleGoogleLoginClick = () => {
    // TODO: implement oauth2
    console.log("Google OAuth not implemented yet");
  };

  const handleOnClickLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await signIn({ username, password });
      console.log("🔍 Login component - signIn completed successfully");
    } catch (err: unknown) {
      console.error("🔍 Login component - Error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const displayError = error || state.error;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h3>Welcome Back</h3>
          <p>Enter to access all features</p>
          <form onSubmit={handleOnClickLogin}>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              className={styles.inputP}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            {/* TODO: add forgot password */}
            <a
              href=""
              className={styles.forgotPassword}
              style={{ display: "inline" }}
            >
              Forgot your Password?
            </a>

            {displayError && (
              <p
                style={{
                  color: "red",
                  padding: "0",
                  margin: "0",
                  alignSelf: "start",
                  position: "relative",
                  bottom: "10px",
                }}
              >
                {displayError}
              </p>
            )}
            <Button
              variant="primary"
              className={styles.buttonLogin}
              type="submit"
              disabled={loading || state.loading}
            >
              {loading || state.loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className={styles.dividerContainer}>
            <hr className={styles.hr} /> <p>Or, Login with</p>{" "}
            <hr className={styles.hr}></hr>
          </div>
          <button
            type="button"
            className={styles.buttonGoogle}
            onClick={handleGoogleLoginClick}
          >
            <img src={googleLogo} alt="Google logo" />
            Continue with google
          </button>
          <p className={styles.registerP}>Don't have an accont ?</p>
          <Link to={"/register"}>Register here</Link>
        </div>
        <div className={styles.imageContainer}>
          <img src={logo} alt="Logo image" />
        </div>
      </div>
    </div>
  );
}
