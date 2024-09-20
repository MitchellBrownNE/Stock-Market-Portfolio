import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  // useState hook for updating state of email, password, and message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // add custom error codes based on each firebase case for denied authenticatioono
  const errorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please use another email or login.";
      case "auth/weak-password":
        return "The password is too weak. Password should be at least 6 characters long.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  // function to register user with firebase authentication
  const registerUser = async () => {
    setLoading(true);
    try {
      // verify both password are identical - strict inequality
      if (password !== confirmPassword) {
        setMessage("Passwords do not match. Please try again.");
        setLoading(false);
        return;
      }

      // firebase function to create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setMessage(`User with email: ${user.email} successfully registered `);
      console.log("User registered:", user);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // set custom error message from errorMessage function
      const customMessage = errorMessage(error.code);
      setMessage(customMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="text-3xl font-heading mt-10">
        <div className="text-white">Register</div>
      </div>
      {/* Email input -- update setEmail based on event when user interacts with input form */}
      <div className="flex flex-col justify-center items-center mt-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded w-80"
        />
        {/* password input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded w-80 mt-5"
        />
        {/* confirm password input */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="p-2 border border-gray-300 rounded w-80 mt-5"
        />
        {/* call registerUser when button is clicked*/}
        <button
          className="bg-lightgreen font-body text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none mt-10"
          onClick={registerUser}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-white font-body mt-5">{message}</p>
      </div>
    </div>
  );
}

export default Register;
