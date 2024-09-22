import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  // State for email, password, message, and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  // Function to log in user with Firebase Authentication
  const loginUser = async () => {
    setLoading(true);
    try {
      // Firebase function to log in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setMessage("Login successful!");
      console.log("User logged in:", user);

      navigate("/dashboard");
    } catch (error) {
      setMessage("Failed to log in. Please check your email or password.");
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="text-3xl font-heading mt-10">
        <div className="text-white">Login</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded w-80"
        />
        {/* Password Input with visibility toggle */}
        <div className="relative w-80 mt-5">
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button
          className={`bg-lightgreen font-body text-white  text-lg px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none mt-10 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={loginUser}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-white font-body mt-5">{message}</p>
      </div>
    </div>
  );
}

export default Login;
