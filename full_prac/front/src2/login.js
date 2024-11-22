import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function verify(e) {
    e.preventDefault();
    try {
      let response = await fetch(
        `http://localhost:5000/verifying?username=${username}&password=${password}`
      );
      if (response.ok) {
        let data = await response.json();
        if (data.user?.username === username) {
          alert("Login Successfull !!!");
          navigate("/home");
        } else {
          alert("Password Doesn't match!");
        }
      } else {
        let errorData = await response.json();
        alert(errorData.error || "Invalid credentials.");
      }
    } catch (error) {
      alert("An error occurred while verifying credentials.");
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <form onSubmit={verify}>
          <div>
            <label className="login-label">USERNAME :</label>
            <input
              className="login-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="login-label">PASSWORD :</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-input">
            Submit
          </button>
        </form>
        <div className="login-label">
          New user ?{" "}
          <button
            onClick={() => {
              navigate("./signup");
            }}
          >
            Sign-Up
          </button>
        </div>
        <div className="login-label">
          Forgot Password ?
          <button
            onClick={() => {
              navigate("./fop");
            }}
          >
            Sign-Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
