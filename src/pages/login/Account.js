import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import "./Account.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
const Account = () => {
  useEffect(() => {
    console.log("accoutn scren");
  }, []);
  return (
    <div className="account">
      <div className="account-header">
        {/* <ArrowBackIcon /> */}
        <Typography
          padding={3}
          textAlign="center"
          fontFamily={"Mulish"}
          letterSpacing={"-0.01em"}
          fontSize={24}
          fontWeight={700}
          className="account-title"
        >
          Confirm Email
        </Typography>
      </div>
      {/* <div className="seperator" /> */}
      <div className="body-content">
        <div className="upload-image">
          <ImageOutlinedIcon fontSize="large" />
        </div>
        <Typography
          paddingTop={2}
          fontFamily={"Mulish"}
          letterSpacing={"-0.01em"}
          className="heading-m"
          fontSize={32}
          fontWeight={700}
        >
          Heading M
        </Typography>
        <Typography
          paddingTop={2}
          fontFamily={"Mulish"}
          letterSpacing={"-0.06em"}
          className="body-text"
        >
          Please click on the link we sent to your email to confirm your
          account.
        </Typography>
        <Typography
          paddingTop={2}
          fontFamily={"Mulish"}
          letterSpacing={"-0.06em"}
          className="email-body"
          fontSize={16}
          fontWeight={700}
        >
          I didn’t get an email
        </Typography>
      </div>
    </div>
  );
};

export default Account;
