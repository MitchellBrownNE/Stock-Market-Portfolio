import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"; // Ensure Firebase and Firestore are correctly imported
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions for saving and fetching data

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [savedName, setSavedName] = useState("");

  useEffect(() => {
    // Fetch the authenticated user's email and saved profile info from Firestore
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      fetchUserProfile(); // Fetch user's saved profile info
    }
  }, []);

  // Function to save user profile to Firestore
  const handleSave = async () => {
    const fullName = `${firstName} ${lastName}`;
    setSavedName(fullName);
    
    try {
      // Save the user's profile info in Firestore under their UID
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        phone,
        email: auth.currentUser.email, // Store their email
      });
      console.log("User profile saved successfully!");
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  // Function to fetch user profile from Firestore
  const fetchUserProfile = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setPhone(userData.phone || "");
        setSavedName(`${userData.firstName} ${userData.lastName}`);
        console.log("User profile fetched successfully!");
      } else {
        console.log("No profile data found for user.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-10 font-body relative bg-bgdark min-h-screen">
      {/* Display saved name at the top */}
      <div className="col-span-12 flex justify-center">
        <div className="bg-white p-5 rounded-lg w-full max-w-md">
          <div className="text-center">
            {savedName ? (
              <h2 className="text-4xl font-heading text-black">
                Welcome, {savedName}
              </h2>
            ) : (
              <h2 className="text-4xl font-heading text-black">Profile</h2>
            )}
          </div>
        </div>
      </div>

      {/* Profile info section */}
      <div className="col-span-12 bg-white p-5 rounded-lg mt-5">
        <div className="flex justify-between">
          <h2 className="text-3xl font-heading text-black">Edit Profile</h2>
          <button
            onClick={handleSave}
            className="bg-lightgreen text-black px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </div>

        <p className="text-blue-600 text-lg mt-2">Update your profile information below</p>

        {/* Profile input form */}
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">First Name</p>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <p className="text-gray-600">Last Name</p>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
