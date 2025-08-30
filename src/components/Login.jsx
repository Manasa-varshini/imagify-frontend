import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Login = ({ setShowLogin }) => {
  const { setUser } = useContext(AppContext);

  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Fixed backend API base URL
  const API_BASE = "https://imagify-backend-2-3rj7.onrender.com";

  // 🔹 Handle login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      state === "Login"
        ? `${API_BASE}/api/user/login`
        : `${API_BASE}/api/user/register`;

    const payload =
      state === "Login" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setShowLogin(false);
        alert(`${state} successful`);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  // 🔹 Handle forgot password
  const handleForgotPassword = async () => {
    if (!forgotEmail || !newPassword) {
      alert("Please enter both email and new password");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });

      const data = await res.json();
      console.log("Forgot Password Response:", data);

      if (res.ok) {
        alert("Password reset successful. You can now login.");
        setShowForgotPassword(false);
        setForgotEmail("");
        setNewPassword("");
      } else {
        alert(data.message || "Password reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {!showForgotPassword ? (
        <form onSubmit={handleSubmit}>
          <h2>{state}</h2>

          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{state}</button>

          {state === "Login" && (
            <p
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </p>
          )}

          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
          >
            {state === "Login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </form>
      ) : (
        <div>
          <h2>Reset Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={handleForgotPassword}>Reset Password</button>
          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setShowForgotPassword(false)}
          >
            Back to Login
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
