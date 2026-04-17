import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const { email, name, password, confirmPassword } = formData;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token") !== null;
    if (isAuthenticated) navigate("/chat");
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      console.log("Registration Data:", { email, password });
      fetch(`${import.meta.env.VITE_API_BASE_URL}user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 200) {
            navigate("/login");
          } else alert(result.message);
        });
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Name</label>
          <input
            type="name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: { display: "flex", flexDirection: "column" },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: { color: "red", fontSize: "0.8rem", marginBottom: "10px" },
};

export default Register;
