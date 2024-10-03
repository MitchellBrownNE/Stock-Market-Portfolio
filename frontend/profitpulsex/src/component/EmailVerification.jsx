import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { sendEmailVerification } from "firebase/auth"; // Function to send email verification
import { useNavigate } from "react-router-dom";

function EmailVerification() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false); // State to show loading when checking verification
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser; // Get current logged-in user

    if (user && !user.emailVerified) {
      // Send verification email if user is registered but not verified
      sendVerificationEmail();
    } else if (user && user.emailVerified) {
      // If the user is already verified, redirect them to the dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const sendVerificationEmail = async () => {
    setLoading(true);
    const user = auth.currentUser;
    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Error sending verification email.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfVerified = async () => {
    setCheckLoading(true);
    try {
      await auth.currentUser.reload(); // Reload user to get updated verification status
      if (auth.currentUser.emailVerified) {
        setMessage("Email verified! Redirecting...");
        navigate("/dashboard"); // Redirect if verified
      } else {
        setMessage("Your email is not verified yet. Please check your email.");
      }
    } catch (error) {
      setMessage("Error checking verification status.");
      console.error(error);
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-sm shadow-lg bg-white text-center">
        <h2 className="text-4xl font-heading text-black">Email Verification</h2>
        <p className="text-black mt-4">{message}</p>
        <button
          onClick={sendVerificationEmail}
          disabled={loading}
          className="bg-lightgreen font-body text-black text-lg px-6 py-2 rounded-lg mt-8 hover:bg-green-600"
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>
        <button
          onClick={checkIfVerified}
          disabled={checkLoading}
          className="bg-lightgreen font-body text-black text-lg px-6 py-2 rounded-lg mt-4 hover:bg-green-600"
        >
          {checkLoading ? "Checking..." : "Check Verification Status"}
        </button>
      </div>
    </div>
  );
}

export default EmailVerification;
