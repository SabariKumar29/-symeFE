import React, { useEffect } from "react";
import axios from "axios";

const clientId = "YOUR_FACEBOOK_APP_ID";
const clientSecret = "YOUR_FACEBOOK_APP_SECRET";
const redirectUri = "http://localhost:3000/facebook-redirect";

const FacebookRedirect = () => {
  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const response = await axios.get(
        "https://graph.facebook.com/v10.0/oauth/access_token",
        {
          params: {
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            code,
          },
        }
      );

      console.log("Facebook Access Token:", response.data.access_token);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  return <div>Loading...</div>;
};

export default FacebookRedirect;
