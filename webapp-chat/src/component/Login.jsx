import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token") !== null;
    if (isAuthenticated) navigate("/chat");
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_BASE_URL}user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          localStorage.setItem("access_token", result.token);
          navigate("/chat");
        } else alert(result.message);
      });
    console.log("on submit: ", formData);
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
      <p style={styles.footerText}>
        Don&apos;t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  form: { display: "flex", flexDirection: "column" },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  footerText: { marginTop: "15px", textAlign: "center", fontSize: "14px" },
};

export default Login;
