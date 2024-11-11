import React from "react";
import axios from "axios";
import { api } from "../../../api/api";

const backendUrl = process.env.BACKEND_HOST || "http://localhost:3001/";

const LoginTikTok = () => {
  const handleLogin = async () => {
    const response = await axios.get(`${backendUrl}auth/tiktok-oauth`);
    window.location.href = `${response.data.url}`;
  };

  return <button onClick={handleLogin}>Login with TikTok</button>;
};

export default LoginTikTok;
