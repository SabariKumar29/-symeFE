import React from 'react';

const clientId = 'YOUR_SNAPCHAT_CLIENT_ID';
const redirectUri = 'http://localhost:3000/snapchat-redirect';

const LoginSnapchat = () => {
  const handleLogin = () => {
    const snapchatAuthUrl = `https://accounts.snapchat.com/accounts/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=snapchat_ads.read&response_type=code`;
    window.location.href = snapchatAuthUrl;
  };

  return (
    <button onClick={handleLogin}>Login with Snapchat</button>
  );
};

export default LoginSnapchat;
