import React from "react";

function EmailVerification() {
  return (
    <div className="min-h-screen bg-bgdark flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-sm shadow-lg bg-white text-center">
        <h2 className="text-4xl font-heading text-black">Email Verification</h2>
        <p className="text-black mt-4">
          We have sent you a verification email. Please check your inbox and click the verification link.
        </p>
      </div>
    </div>
  );
}

export default EmailVerification;
