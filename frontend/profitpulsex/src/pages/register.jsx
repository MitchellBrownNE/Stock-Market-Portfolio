import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  // useState hook for updating state of email, password, and message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    try {
      // firebase function to create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setMessage(`User with email: ${user.email} successfully registered `);
      console.log("User registered:", user);
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error registering user");
    }
  };

  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="text-3xl font-heading mt-10">
        <div className="text-white">Register</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded w-80"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded w-80 mt-5"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="p-2 border border-gray-300 rounded w-80 mt-5"
        />
        <button
          className="bg-lightgreen font-body text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none mt-10"
          onClick={registerUser}
        >
          Register
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Register;
