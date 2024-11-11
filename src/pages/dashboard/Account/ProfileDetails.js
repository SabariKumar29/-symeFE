import React from "react";
import "./Profile.css";
import { Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Profile from "../../../resources/profile.png";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const ProfileDetails = () => {
  const keywords = [
    "lifestyle",
    "urban",
    "classy",
    "active",
    "classy",
    "active",
  ];
  return (
    <div className="profile">
      <div className="profile-header">
        <div className="header-back">
          <ArrowBackIcon />
          <Typography
            padding={3}
            textAlign="center"
            alignSelf={"flex-start"}
            fontFamily={"Mulish"}
            letterSpacing={"-0.01em"}
            fontSize={24}
            fontWeight={700}
            //   className="profile-header"
          >
            Complete your profile
          </Typography>
        </div>
        <DoneOutlinedIcon />
      </div>
      <div className="seperator" />
      <div className="profile-view">
        <div className="profile-background"></div>
        <div className="profile-image">
          <img
            alt="loading"
            src={Profile}
            height={120}
            width={120}
            className="profile-pic"
          ></img>
        </div>
        <div>
          <Typography
            padding={1}
            textAlign="center"
            fontFamily={"Mulish"}
            letterSpacing={"-0.01em"}
            fontSize={32}
            fontWeight={700}
          >
            John Doe
          </Typography>
        </div>
      </div>
      <div className="profile-body">
        <div className="keywords-view">
          {keywords.map((item) => {
            return (
              <div className="keywords-item">
                <Typography
                  padding={1}
                  textAlign="center"
                  fontFamily={"Mulish"}
                  letterSpacing={"-0.01em"}
                  fontSize={32}
                  fontWeight={700}
                >
                  {item}
                </Typography>
              </div>
            );
          })}
          <div className="keywords-item flex-row">
            <AddIcon />
            <Typography
              padding={1}
              textAlign="center"
              fontFamily={"Mulish"}
              letterSpacing={"-0.01em"}
              fontSize={32}
              fontWeight={700}
            >
              {"Keywords"}
            </Typography>
          </div>
        </div>
        <div className="location">
          <div className="location-icon">
            <LocationOnIcon />
            <Typography
              padding={1}
              textAlign="center"
              fontFamily={"Mulish"}
              letterSpacing={"-0.01em"}
              fontSize={32}
              fontWeight={700}
            >
              Location
            </Typography>
          </div>
          <div className="add-location">
            <AddIcon />
          </div>
        </div>
        <Typography
          padding={1}
          textAlign="left"
          fontFamily={"Mulish"}
          letterSpacing={"-0.01em"}
          fontSize={16}
          fontWeight={700}
        >
          Social Media
        </Typography>
        <div className="seperator" />
        <div className="link-view">
          <PriorityHighIcon />
          <Typography
            padding={1}
            textAlign="left"
            fontFamily={"Mulish"}
            letterSpacing={"-0.01em"}
            fontSize={16}
            fontWeight={600}
          >
            Link more social media accounts to strengthen your profile
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default ProfileDetails;
