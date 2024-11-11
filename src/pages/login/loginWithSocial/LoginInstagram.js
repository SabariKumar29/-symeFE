import React from "react";
import axios from "axios";
import { api } from "../../../api/api";

const backendUrl = process.env.BACKEND_HOST || "http://localhost:3001/";

const LoginInstagram = () => {
  const handleLogin = async () => {
    const response = await axios.get(`${backendUrl}auth/instagram-oauth`);
    window.location.href = `${response.data.url}`;
  };

  return <button onClick={handleLogin}>Login with Instagram</button>;
};

export default LoginInstagram;
