import styles from "./Register.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import abstractBg from "../../assets/bg_register.jpg";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h3>Create Account</h3>
          <form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              className={styles.inputP}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              className={styles.inputP}
              type="email"
              value={email}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "... " : "Register"}
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
