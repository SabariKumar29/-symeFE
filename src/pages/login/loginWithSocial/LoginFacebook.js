import React from "react";

const clientId = "YOUR_FACEBOOK_APP_ID";
const redirectUri = "http://localhost:3000/facebook-redirect";

const LoginFacebook = () => {
  const handleLogin = () => {
    const facebookAuthUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email,public_profile`;
    window.location.href = facebookAuthUrl;
  };

  return <button onClick={handleLogin}>Login with Facebook</button>;
};

export default LoginFacebook;
