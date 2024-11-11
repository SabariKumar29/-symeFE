import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { meAtom } from "../../atoms/meAtom";
import { getSessionId, getSessionUser } from "../../utils/localStorage";
import { api } from "../../api/api";
import io from "socket.io-client";

import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import NoImage from "../../resources/no-image.png";
import GiftImage from "../../resources/gift.svg";
import BookingImage from "../../resources/icon-calendar-target.svg";
import MessageImage from "../../resources/icon-message-square.svg";
import DashboardImage from "../../resources/icon-dashboard.svg";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Search from "./Search";
import OffersInfluencer from "./OffersInfluencer/OffersInfluencer";
import OffersBusiness from "./OffersBusiness/OffersBusiness";
import Chats from "./Chats/Chats";
import Account from "../login/Account";

const chatUrl = process.env.BACKEND_HOST || "http://localhost:3005";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState("1");
  const [user, setUser] = useRecoilState(meAtom);
  const [menuValue, setMenuValue] = useState(0);
  const sessionId = getSessionId();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [chatDiscussions, setChatDiscussions] = useState([]);
  const { height, width } = useWindowDimensions();

  const socket = io(chatUrl, {
    transports: ["websocket", "polling", "flashsocket"],
  });

  const joinChat = (userId) => {
    try {
      socket.emit("join_chat", { userId });
    } catch (error) {
      console.error("Error joining chat:", error);
    }
  };

  const sendMessage = (senderId, recipientId, message, discussionId) => {
    try {
      socket.emit("send_message", {
        senderId,
        recipientId,
        message,
        discussionId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateDiscussions = (discussion) => {
    console.log(discussion);
    const discussionIndex = chatDiscussions.findIndex(
      (item) => item.discId === discussion.discId
    );
    if (discussionIndex === -1) {
      setChatDiscussions((prevChatDiscussions) => [
        ...prevChatDiscussions,
        discussion,
      ]);
    } else {
      const updatedDiscussions = chatDiscussions.map((item, i) => {
        if (i === discussionIndex) {
          // Increment the clicked counter
          return discussion;
        } else {
          // The rest haven't changed
          return item;
        }
      });
      setChatDiscussions(updatedDiscussions);
    }
  };

  useEffect(() => {
    const sessionUser = getSessionUser();
    setUser(sessionUser);
    if (sessionUser) {
      joinChat(sessionUser.userId);
    }
    socket.on("chat_history", (discussions) => {
      setChatDiscussions(discussions);
    });

    socket.on("receive_message", (discussion) => {
      updateDiscussions(discussion);
    });
  }, []);

  const handleSelectFile = (e) => setFile(e.target.files[0]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const userId = user.userId;
      const data = new FormData();
      data.append("my_file", file);
      data.append("userId", userId);
      const res = await api.postUpload(
        "barracks/user/uploadImage",
        data,
        user.userId
      );
      console.log(res);
      setRes(res.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    if (user.profileImage) {
      const imageArray = user.images.find(
        (item) => item.id === user.profileImage
      );
      if (imageArray && imageArray.length > 0) {
        setProfileImageUrl(imageArray[0].url);
      }
    }
  }, [user]);

  const getImageIndex = (id, imagesArray) => {
    const index = imagesArray.findIndex((item) => item.imageId === id);
    return index;
  };
  const LoadComponent = (props) => {
    const menuValue = props.menuValue;
    const userType = props.userType;
    if (userType === "influencer") {
      if (menuValue === 0) {
        return <OffersInfluencer />;
      } else if (menuValue === 1) {
        return <div>bookings</div>;
      } else if (menuValue === 2) {
        return <Chats />;
      } else {
        return <Account />;
      }
    } else {
      if (menuValue === 0) {
        return <div>Dashboard</div>;
      } else if (menuValue === 1) {
        return <OffersBusiness />;
      } else if (menuValue === 2) {
        return <div>bookings</div>;
      } else if (menuValue === 3) {
        return <Chats />;
      } else {
        return <Account />;
      }
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <CssBaseline />
      <div
        className="main-component-area"
        style={{ height: `${height - 56}px` }}
      >
        <LoadComponent menuValue={menuValue} userType={user.type} />
      </div>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        {user && user.type === "influencer" ? (
          <BottomNavigation
            showLabels
            value={menuValue}
            onChange={(event, newValue) => {
              setMenuValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Offers"
              icon={<img src={GiftImage} alt={"offersImage"} />}
            />
            <BottomNavigationAction
              label="Bookings"
              icon={<img src={BookingImage} alt={"bookingsImage"} />}
            />
            <BottomNavigationAction
              label="Messages"
              icon={<img src={MessageImage} alt={"messagesImage"} />}
            />
            <BottomNavigationAction
              label="Account"
              icon={
                <img
                  src={
                    user.profileImage && user.images
                      ? user.images[
                          getImageIndex(user.profileImage, user.images)
                        ].url
                      : NoImage
                  }
                  height={25}
                  width={25}
                  alt={"AccountImage"}
                />
              }
            />
          </BottomNavigation>
        ) : (
          <BottomNavigation
            showLabels
            value={menuValue}
            onChange={(event, newValue) => {
              setMenuValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Dashboard"
              icon={<img src={DashboardImage} alt={"dashboardImage"} />}
            />
            <BottomNavigationAction
              label="Offers"
              icon={<img src={GiftImage} alt={"offersImage"} />}
            />
            <BottomNavigationAction
              label="Bookings"
              icon={<img src={BookingImage} alt={"bookingsImage"} />}
            />
            <BottomNavigationAction
              label="Messages"
              icon={<img src={MessageImage} alt={"messagesImage"} />}
            />
            <BottomNavigationAction
              label="Account"
              icon={
                <img
                  src={
                    user.profileImage && user.images
                      ? user.images[
                          getImageIndex(user.profileImage, user.images)
                        ].url
                      : NoImage
                  }
                  height={25}
                  width={25}
                  alt={"AccountImage"}
                />
              }
            />
          </BottomNavigation>
        )}
      </Paper>
    </div>
  );
};

export default Dashboard;
