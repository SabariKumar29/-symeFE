import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Button,
  CardContent,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import noDataFound from "../../assets/image/noDataFound.png";
import wfBadge from "../../assets/image/wfBadge.jpg";
import chatslogo from "../../assets/image/chatslogo.png";
import avatar from "../../assets/image/avatar.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyButton from "../MyButton";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {
  useGetNotificationListMutation,
  useGetNotificationUpdateMutation,
  useGetMessageListMutation,
  useSaveMessageMutation,
  useGetUserChatListMutation,
  useUploadImageMutation,
} from "../../services/apiService/userApiService";
import toaster from "../Toaster/toaster";
import { socket } from "../../services/Socket/Socket";
import useLoading from "../../hooks/useLoading";
import { setMessageCount } from "../../store/Slicers/messageSlice";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OutlinedCard = () => {
  const navigate = useNavigate();
  const { userDtls } = useSelector((state) => state?.auth);
  const { startLoading, stopLoading } = useLoading();
  // const [imageUpload] = useUploadImageMutation();
  const [updateNotification] = useGetNotificationUpdateMutation();
  const [getNotification] = useGetNotificationListMutation();
  const [getMessageList] = useGetMessageListMutation();
  // const [saveMessage] = useSaveMessageMutation();
  const [userchatList] = useGetUserChatListMutation();
  const [conversation, setConversation] = React.useState([]);
  const [isCompany, setIsCompany] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [aCmpyDetails, setCmpyDetails] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [blockedMessageIndex, setBlockedMessageIndex] = React.useState(null);
  const [dataNotFound, setDataNotFound] = React.useState(false);
  // const [message, setMessage] = useState(""); // Message input
  const [messages, setMessages] = useState([]); // Chat messages array
  const [usersDetails, setUsers] = useState([]);
  const [conversationTimeDetails, setConversationTime] = useState();
  const dispatch = useDispatch();
  // const [image, setImage] = useState([]);

  socket.on("receivedMessage", (newMessage) => {
    const msg = [...messages, newMessage];
    setMessages(msg);
    // scrollToBottom();
  });

  useEffect(() => {
    conversationList();
    socket.connect();
    socket.emit("setup", { _id: userDtls?.userId });

    return () => {
      socket.disconnect();
      socket.off("new message");
      socket.off("notification");
    };
  }, [userDtls?.userId]);

  const conversationList = async () => {
    startLoading();
    try {
      const payload = {
        id: userDtls?.userId,
      };

      const response = await getMessageList(payload);
      if (response?.data?.data) {
        setConversation(response?.data?.data);
        setUsers(response?.data?.data?.[0]);
        const lastConversationTime = timeAgo(
          response?.data?.data?.[0]?.latestMessage?.createdAt
        );
        setConversationTime(lastConversationTime);
      } else {
        toaster("error", response?.error?.data?.message || "No data");
      }
    } catch (error) {
      toaster("error", "Something went wrong");
    }
    stopLoading();
  };

  const timeAgo = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const timeDifference = now - createdAtDate; // Time difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  /**Notification list api */
  const notificationData = async () => {
    try {
      const response = await getNotification({
        id: userDtls?.userId,
        filter: { sort: "createdAt" },
      }).unwrap();
      if (response?.data?.length) {
        const updatedData = response.data
          ?.filter((ele) => ele?.recipientId === userDtls?.userId)
          ?.map((item) => ({
            ...item,
            timeAgo: timeAgo(item.createdAt),
          }));
        setNotificationList(updatedData);
        dispatch(
          setMessageCount(
            updatedData?.filter((ele) => !ele?.isRead)?.length || 0
          )
        );
      }
    } catch (error) {
      if (error?.data?.message === "No records found") {
        toaster("error", "No records found");
        setDataNotFound(true);
      } else if (error?.data?.message === "Invalid request") {
        toaster("error", "Invalid request");
      } else {
        toaster("error", "Something went wrong");
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportClick = () => {
    setBlockedMessageIndex(0);
    setAnchorEl(null);
  };

  const handleCardClick = async (selectedItem) => {
    const updatedItem = { ...selectedItem, isRead: true };
    try {
      const payload = {
        id: updatedItem?._id,
        ...updatedItem,
      };
      const responce = await updateNotification(payload);

      if (responce?.data) {
        notificationData();
      } else if (responce?.error?.data?.message === "Invalid request") {
        toaster("error", "Invalid request");
      }
    } catch (error) {
      toaster("error", "Something went wrong");
    }
  };

  const handleClickConversations = (arrayDetails) => {
    // userChatListData(arrayDetails);
    // setIsCompany(true);
    // setCmpyDetails(arrayDetails);
    navigate(`/chat/${arrayDetails?._id}`);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const container = document.getElementById("chat-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      console.error('Element with class "chats-details" not found.');
    }
  };
  return (
    <Stack className="message-header">
      <Box sx={{ width: "100%" }} className="content-box">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="web-view-tabs"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Conversations"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Notifications"
              {...a11yProps(1)}
              onClick={() => notificationData()}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} className="company-tab">
          {/* {isCompany ? ( */}
          {/* ) : ( */}
          <Stack>
            <Stack>
              {conversation.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    marginBottom: 2,
                    borderRadius: "10px",
                  }}
                  className="card-header"
                  onClick={() => handleClickConversations(item)} // Add onClick conversation
                >
                  <div className="Conversations">
                    {item?.userDetail
                      ?.filter((value) => value?.userId !== userDtls?.userId)
                      .map((value, i) => (
                        <card key={i}>
                          <Avatar
                            className="image-notification"
                            src={value?.profileImage || avatar}
                            sx={{ width: "65px", height: "65px" }}
                          />
                        </card>
                      ))}
                    <div className="typo-Conversations">
                      <div className="notification-title">
                        {item?.userDetail
                          ?.filter(
                            (value) => value?.userId !== userDtls?.userId
                          )
                          .map((value, i) => (
                            <Typography
                              key={i}
                              variant="h5"
                              component="div"
                              sx={{
                                width: "130px",
                                color: "#65558f",
                                fontWeight: "600",
                                wordBreak: "break-all",
                              }}
                            >
                              {value?.username}
                            </Typography>
                          ))}
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                          className="notification-hours"
                        >
                          {conversationTimeDetails}
                        </Typography>
                      </div>
                      {/* <Button sx={{ width: "100px" }} variant="outlined">
                          {item.type}
                        </Button> */}
                      {item?.latestMessage?.content === "" ? (
                        <Avatar src={avatar}></Avatar>
                      ) : (
                        <Typography color="text.secondary">
                          {item?.latestMessage?.content}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                    className="web-hours"
                  >
                    {conversationTimeDetails}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Stack>
          {/* )} */}
        </TabPanel>
        <TabPanel value={value} index={1} className="content-tab">
          {notificationList.map((item, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: 2,
                backgroundColor: item.isRead ? "white" : "#fef7ff", // Conditionally set background color
              }}
              className="card-header"
              onClick={() => {
                if (item?.isRead) {
                  return;
                }
                handleCardClick(item); // Proceed with the click action if not read
              }}
            >
              <div className="notification">
                <img
                  className="image-notification"
                  component="img"
                  src={item?.sender?.image || avatar}
                  alt="loading"
                />
                <div className="typo-notification">
                  <div className="notification-title">
                    <Typography variant="h5" component="div">
                      {item?.sender?.username}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                      className="notification-hours"
                    >
                      {item?.timeAgo}
                    </Typography>
                  </div>
                  <Typography color="text.secondary">{item.message}</Typography>
                </div>
                <Typography
                  sx={{ fontSize: 14, width: "10%" }}
                  color="text.secondary"
                  gutterBottom
                  className="web-hours"
                >
                  {item?.timeAgo}
                </Typography>
              </div>
            </Card>
          ))}
          {dataNotFound && <img src={noDataFound} alt="loading"></img>}
        </TabPanel>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="mobile-view-tabs"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Conversations" {...a11yProps(0)} />
            <Tab
              label="Notifications"
              {...a11yProps(1)}
              onClick={() => notificationData()}
            />
          </Tabs>
        </Box>
      </Box>
    </Stack>
  );
};

export default OutlinedCard;
