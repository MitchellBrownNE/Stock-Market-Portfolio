import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  // useState hook for updating state of email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div>
      <div className="text-xl font-heading flex flex-col justify-center items-center mt-10">
        <div className="text-bgdark">Register Page</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={registerUser}>Register</button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Register;
