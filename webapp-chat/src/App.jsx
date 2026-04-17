import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Chat from "./component/Chat";
import ProtectedRoute from "./component/ProtectedRoute";

// Create a Header component to access navigation hooks
const Navigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access_token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>MyChatApp</div>
      <div style={styles.links}>
        {!isAuthenticated ? (
          <>
            <Link style={styles.link} to="/login">
              Login
            </Link>
            <Link style={styles.link} to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <div>Welcome to the Chat App</div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Default route to Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* --- Protected Routes Start --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          {/* Add other private pages here, like /profile or /settings */}
        </Route>
        {/* --- Protected Routes End --- */}

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<h2>404: Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#007bff",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#1ad21a",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

export default App;
