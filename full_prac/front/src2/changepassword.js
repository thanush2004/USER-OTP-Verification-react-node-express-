import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Changepass() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  if (!email) {
    console.error("Email not provided. Redirecting...");
    navigate("/");
  }

  const [newpass, setNewpass] = useState("");
  const [repass, setRepass] = useState("");
  const [confirm, setConfirm] = useState("");

  async function evaluation(e) {
    e.preventDefault();
    if (newpass === repass) {
      try {
        const res = await fetch(
          `http://localhost:5000/update?password=${newpass}&email=${email}`
        );

        if (res.ok) {
          alert("User updated successfully");
          navigate("/");
        } else alert("Unable to update user");
      } catch (error) {
        console.error("Unable to fetch", error);
      }
    } else {
      setConfirm("not ok");
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Change Password</h2>
        <form>
          <label className="login-label">Enter New Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewpass(e.target.value)}
          />
          <label className="login-label">Re-enter New Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Re-enter new password"
            onChange={(e) => setRepass(e.target.value)}
          />
          <button className="login-input" onClick={evaluation}>
            Proceed
          </button>
          <p>Click to update password for {email}</p>
          {confirm && <AlertDisplay />}
        </form>
      </div>
    </div>
  );
}

export default Changepass;

export const AlertDisplay = () => {
  return (
    <div>
      <h4>Passwords do not match</h4>
    </div>
  );
};
