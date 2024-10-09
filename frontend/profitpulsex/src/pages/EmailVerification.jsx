import React, { useState, useEffect } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Ensure auth is correctly imported

function EmailVerification() {
  const [loading, setLoading] = useState(true); // Loading state
  const [success, setSuccess] = useState(false); // Success message state
  const [error, setError] = useState(""); // Error message state
  const [resendLoading, setResendLoading] = useState(false); // Resend button loading state

  // Simulate the email verification process
  useEffect(() => {
    sendVerificationEmail();
  }, []);

  // Function to send verification email
  const sendVerificationEmail = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser); // Firebase function to send verification email
        setSuccess(true);
      } else {
        setError("No user is logged in.");
      }
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        setError(
          "Too many requests. Please try again later or check your email spam folder."
        );
      } else {
        setError("Error sending verification email. Please try again.");
      }
      console.error("Email verification error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle resend
  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser); // Firebase resend function
        setSuccess(true);
      } else {
        setError("No user is logged in.");
      }
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        setError(
          "Too many requests. Please try again later or check your email spam folder."
        );
      } else {
        setError("Error resending verification email. Please try again.");
      }
      console.error("Resend email verification error: ", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-sm shadow-lg bg-white text-center">
        {loading ? (
          <>
            <h2 className="text-4xl font-heading text-black mb-4">
              Sending Verification Email...
            </h2>
            {/* Loading spinner */}
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : success ? (
          <>
            <h2 className="text-4xl font-heading text-black">
              Email Verification
            </h2>
            <p className="text-black mt-4">
              We have sent you a verification email. Please check your inbox and
              click the verification link.
            </p>
            <p className="text-gray-600 mt-4">
              Didn’t receive the email? Check your spam folder or click the button
              below to resend.
            </p>
            {/* Resend Button */}
            <button
              onClick={handleResend}
              className={`bg-lightgreen font-body text-black text-lg px-6 py-2 rounded-lg hover:bg-green-600 mt-4 ${
                resendLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend Email"}
            </button>
          </>
        ) : error ? (
          <>
            <h2 className="text-4xl font-heading text-black">Error</h2>
            <p className="text-red-600 mt-4">{error}</p>
            <button
              onClick={handleResend}
              className={`bg-lightgreen font-body text-black text-lg px-6 py-2 rounded-lg hover:bg-green-600 mt-4 ${
                resendLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Try Again"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default EmailVerification;
