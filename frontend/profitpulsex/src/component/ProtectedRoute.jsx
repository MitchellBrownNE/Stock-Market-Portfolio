import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

function ProtectedRoute({ children }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking authentication
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" />; // Redirect to email verification if not verified
  }

  return children; // Render the children components if email is verified
}

export default ProtectedRoute; // Ensure this is a default export
