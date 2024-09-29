// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // your Firebase config
import { confirmPasswordReset } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const oobCode = searchParams.get("oobCode"); // Get the reset token from the URL
      if (!oobCode) {
        setMessage("Invalid or expired reset link.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("Error: Unable to reset password.");
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-sm shadow-lg bg-white">
        <h2 className="text-4xl font-heading text-center mb-8 text-black">
          Reset Password
        </h2>

        {/* New Password Input */}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="p-2 border border-black rounded w-80"
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="p-2 border border-black rounded w-80 mt-5"
        />

        {/* Submit Button */}
        <button
          className="bg-lightgreen font-body text-black text-lg px-6 py-2 rounded-lg hover:bg-green-600 mt-10"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-boldred text-black font-body mt-5">{message}</p>
      </div>
    </div>
  );
}

export default ResetPassword;
