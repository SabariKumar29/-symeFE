import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { meAtom } from "../../atoms/meAtom";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { getSessionId, saveSession } from "../../utils/localStorage";
import "./Login.css";
import { LoginSocialInstagram, LoginSocialTiktok } from "reactjs-social-login";
import { InstagramLoginButton } from "react-social-login-buttons";
import LoginTikTok from "./loginWithSocial/LoginTikTok";
import LoginInstagram from "./loginWithSocial/LoginInstagram";

const REDIRECT_URI = "https://86c5-178-174-166-90.ngrok-free.app/";
const Login = () => {
  const [isRegistration, setIsRegistration] = useState(false);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const [userType, setUserType] = useState("influencer");
  const [user, setUser] = useRecoilState(meAtom);

  const handleChangeFields = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeUserType = (e) => {
    setUserType(e.target.value);
  };

  const handleLogin = async (email, password) => {
    const resultLogin = await api.post("auth/user/login", {
      email: email,
      password: password,
    });

    const fetchedUser = await api.get(
      `barracks/user/fetch/${resultLogin.userId}`
    );
    saveSession(resultLogin.sessionId, fetchedUser);
    setUser(fetchedUser);
  };

  useEffect(() => {
    if (sessionId && user.userId) {
      navigate("/dashboard");
    }
  }, [user, sessionId, navigate]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!isRegistration) {
      console.log(inputs);
      await handleLogin(inputs.email, inputs.password);
    } else {
      const result = await api.post("auth/user/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
        type: userType,
      });
      console.log(result);
    }
  };

  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("logout success");
  }, []);

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmitForm}>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={5}
        >
          <Typography
            variant="h3"
            padding={3}
            textAlign="center"
            fontFamily={"Krona One"}
            letterSpacing={"-0.06em"}
            className="login-title"
          >
            {isRegistration ? "Register" : "syme"}
          </Typography>
          {isRegistration && (
            <TextField
              onChange={handleChangeFields}
              value={inputs.name}
              name="name"
              type={"text"}
              variant="outlined"
              placeholder="Name"
              margin="dense"
              inputProps={{
                style: { color: "#ADADC0" },
              }}
              className="login-input-field"
              sx={{
                width: "100%",
              }}
            />
          )}
          <TextField
            onChange={handleChangeFields}
            value={inputs.email}
            name="email"
            type={"email"}
            variant="outlined"
            placeholder="User name"
            margin="dense"
            inputProps={{ style: { color: "#ADADC0" } }}
            className="login-input-field"
            sx={{
              width: "100%",
            }}
          />
          <TextField
            onChange={handleChangeFields}
            value={inputs.password}
            name="password"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            margin="dense"
            inputProps={{ style: { color: "#ADADC0" } }}
            className="login-input-field"
            sx={{
              width: "100%",
            }}
          />
          {isRegistration && (
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Type of account:
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={userType}
                onChange={handleChangeUserType}
              >
                <FormControlLabel
                  value="influencer"
                  control={<Radio />}
                  label="Influencer"
                />
                <FormControlLabel
                  value="business"
                  control={<Radio />}
                  label="Business"
                />
              </RadioGroup>
            </FormControl>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{
              margin: 1,
              borderRadius: "22px",
              width: "100%",
              backgroundColor: "#7371fc",
              textTransform: "none",
            }}
          >
            {isRegistration ? "Register" : "Log in"}
          </Button>

          <Button
            onClick={() => setIsRegistration(!isRegistration)}
            sx={{
              marginTop: 3,
              borderRadius: 3,
              textTransform: "none",
              color: "#696980",
            }}
          >
            {isRegistration ? "Back to login" : "Create an account"}
          </Button>
          {isRegistration ? (
            <></>
          ) : (
            <Button
              onClick={() => setIsRegistration(!isRegistration)}
              sx={{ borderRadius: 3, textTransform: "none", color: "#696980" }}
            >
              Continue without logging in
            </Button>
          )}
        </Box>

        <LoginInstagram />
        <LoginTikTok />
      </form>
    </div>
  );
};

export default Login;
