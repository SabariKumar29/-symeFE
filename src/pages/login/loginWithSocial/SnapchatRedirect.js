import React, { useEffect } from "react";
import axios from "axios";

const clientId = "YOUR_SNAPCHAT_CLIENT_ID";
const clientSecret = "YOUR_SNAPCHAT_CLIENT_SECRET";
const redirectUri = "http://localhost:3000/snapchat-redirect";

const SnapchatRedirect = () => {
  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const response = await axios.post(
        "https://accounts.snapchat.com/accounts/oauth2/token",
        {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        }
      );

      console.log("Snapchat Access Token:", response.data.access_token);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  return <div>Loading...</div>;
};

export default SnapchatRedirect;
