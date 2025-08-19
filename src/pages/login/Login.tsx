import axios from "axios";
import styles from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/bg-login.jpg";
import Button from "react-bootstrap/Button";
import googleLogo from "../../assets/google_logo.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h3>Welcome Back</h3>
          <p>Enter to access all features</p>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <a href="" className={styles.forgotPassword}>
              Forgot your Password?
            </a>
            <Button
              variant="primary"
              className={styles.buttonLogin}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className={styles.dividerContainer}>
            <hr className={styles.hr} /> <p>Or, Login with</p>{" "}
            <hr className={styles.hr}></hr>
          </div>
          <button type="button" className={styles.buttonGoogle}>
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
