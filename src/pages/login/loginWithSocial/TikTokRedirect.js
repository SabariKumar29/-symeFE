import React, { useEffect } from "react";
import axios from "axios";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { meAtom } from "../../../atoms/meAtom";
import { getSessionId, saveSession } from "../../../utils/localStorage";
import { CircularProgress, Box } from "@mui/material";

const backendUrl = process.env.BACKEND_HOST || "http://localhost:3001/";

const TikTokRedirect = () => {
  const sessionId = getSessionId();
  const [user, setUser] = useRecoilState(meAtom);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        const responseAccessToken = await axios.post(
          `${backendUrl}auth/tiktok-accesstoken`,
          {
            code,
          }
        );

        const responseUserData = await axios.post(
          `${backendUrl}auth/tiktok-userdata`,
          {
            accessToken: responseAccessToken.data.access_token,
          }
        );

        console.log(responseUserData.data.user.open_id);

        const resultLogin = await axios.post(
          `${backendUrl}auth/user/loginTikTok`,
          {
            openId: responseUserData.data.user.open_id,
          }
        );
        console.log(resultLogin.data.userId);
        if (resultLogin) {
          const fetchedUser = await api.get(
            `barracks/user/fetch/${resultLogin.data.userId}`
          );
          saveSession(resultLogin.data.sessionId, fetchedUser);
          setUser(fetchedUser);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  useEffect(() => {
    if (sessionId && user.userId) {
      navigate("/dashboard");
    }
  }, [user, sessionId, navigate]);

  return (
    <div>
      <Box
        sx={{
          color: "#65558F",
          height: "100vh",
          width: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    </div>
  );
};

export default TikTokRedirect;
