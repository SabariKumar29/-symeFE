import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/image/avatar.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {
  useGetChatByIdMutation,
  useGetUserChatListMutation,
  useSaveMessageMutation,
  useUploadImageMutation,
} from "../../services/apiService/userApiService";
import toaster from "../Toaster/toaster";
import { socket } from "../../services/Socket/Socket";
import useLoading from "../../hooks/useLoading";
import { useNavigate, useParams } from "react-router-dom";
import Preview from "../Preview/Preview";

const Chat = () => {
  const { userDtls } = useSelector((state) => state?.auth);
  const { chatId } = useParams(); // To get the offer id from URL
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [imageUpload] = useUploadImageMutation();
  const [saveMessage] = useSaveMessageMutation();
  const [userChatById] = useGetUserChatListMutation();
  const [getChatById] = useGetChatByIdMutation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [blockedMessageIndex, setBlockedMessageIndex] = React.useState(null);
  const [message, setMessage] = useState(""); // Message input
  const [messages, setMessages] = useState([]); // Chat messages array
  const [shoePreview, setShowPreview] = useState(false);
  const [previewDetails, setPreviewDetails] = useState({});
  const [chatDetails, setChatDetails] = useState({});
  const [usersDtls, setUsersDetails] = useState([]);
  const [conversationTimeDetails, setConversationTime] = useState();
  const [image, setImage] = useState([]);

  socket.on("receivedMessage", (newMessage) => {
    const msg = [...messages, newMessage];
    setMessages(msg);
  });
  useEffect(() => {
    // conversationList();
    socket.connect();
    socket.emit("setup", { _id: userDtls?.userId });

    return () => {
      socket.disconnect();
      socket.off("new message");
      socket.off("notification");
    };
  }, [userDtls?.userId]);
  const fetchChatUserData = async (chatId) => {
    startLoading();
    try {
      const response = await getChatById(chatId);
      if (response?.data) {
        setUsersDetails(response?.data.data[0].users);
        const chatData = response?.data.data[0].userDetail?.filter((ele) => {
          if (userDtls?.userId !== ele?.userId) {
            return ele;
          }
          return false;
        });
        setChatDetails(chatData[0]);
        stopLoading();
      } else if (response?.error?.data?.message === "No records found") {
        toaster("error", "No Chat found");
        stopLoading();
        navigate(-1);
      }
    } catch (error) {
      toaster("error", error);
      stopLoading();
      navigate(-1);
    }
  };

  const userChatListData = async (id) => {
    startLoading();
    try {
      const response = await userChatById(id);
      if (response?.data) {
        // const chatData = response?.data.data[0].userDetail?.filter((ele) => {
        //   if (userDtls?.userId !== ele?.userId) {
        //     return ele;
        //   }
        //   return false;
        // });
        // setChatDetails(chatData[0]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const messages = response?.data?.data;

        const formattedMessages = messages.map((message) => {
          const dateObject = new Date(message.createdAt);

          const createdDate = new Date(dateObject);
          createdDate.setHours(0, 0, 0, 0);
          const timeOptions = { hour: "2-digit", minute: "2-digit" };

          let dateAndTime;
          if (createdDate.getTime() === today.getTime()) {
            dateAndTime = dateObject.toLocaleTimeString([], timeOptions); // Show only the time for today
          } else if (createdDate.getTime() === yesterday.getTime()) {
            dateAndTime = `Yesterday, ${dateObject.toLocaleTimeString(
              [],
              timeOptions
            )}`; // Show "Yesterday" and the time
          } else {
            dateAndTime = `${dateObject.toLocaleDateString()} ${dateObject.toLocaleTimeString(
              [],
              timeOptions
            )}`; // Show date and time for other days
          }

          return {
            ...message,
            formattedCreatedAt: dateAndTime, // Adding formatted date to message object
          };
        });

        setMessages(formattedMessages); // Set the formatted messages
        stopLoading();
      } else if (response?.error?.data?.message === "No records found") {
        toaster("error", "No Chat history");
        stopLoading();
        // navigate(-1);
      }
    } catch (error) {
      toaster("error", error);
      stopLoading();
      // navigate(-1);
    }
  };

  const saveMessageData = async () => {
    try {
      const payload = {
        content: message,
        senderId: userDtls?.userId,
        chatId: chatId,
      };
      if (image?.length) {
        payload.image = image;
      }
      await saveMessage(payload);
    } catch (error) {
      return;
    }
  };

  const handlerUploadImage = async (event) => {
    try {
      startLoading();
      const formData = new FormData();
      for (let key in event?.target?.files) {
        if (event?.target?.files.hasOwnProperty(key)) {
          formData?.append("files", event?.target?.files[key]);
          console.log(key, event?.target?.files[key]);
        }
      }
      const imageUrl = await imageUpload(formData)?.unwrap();
      console.log("imageUrl", imageUrl);
      if (imageUrl?.data?.length) {
        setImage(imageUrl?.data); // Set the profile image URL
      } else {
        toaster("error", imageUrl?.message);
        return;
      }
    } catch (err) {
      console.error("Failed to image upload:", err);
      toaster("error", "Something went wrong");
    } finally {
      stopLoading();
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    saveMessageData();
    const messagePayload = {
      message,
      chatId: chatId,
      users: usersDtls,
      senderId: userDtls?.userId,
      // aCmpyDetails,
    };

    if (image.length) {
      messagePayload.image = image;
    }
    console.log("messagePayload", messagePayload);

    socket.emit("new message", messagePayload);
    setMessage("");
    setImage([]);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message,
        chatId: chatId,
        image: image,
        users: usersDtls,
        senderId: userDtls?.userId,
        // aCmpyDetails,
      },
    ]);
    // scrollToBottom();
  };

  /**
   *
   * @param {urlList} url list
   * @returns
   */
  const handlerImagePreview = (urlList) => {
    setPreviewDetails({ url: urlList, type: "image" });
    setShowPreview(true);
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

  useEffect(() => {
    if (chatId) {
      userChatListData(chatId);
      fetchChatUserData(chatId);
    }
  }, [chatId]);

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
    <>
      <Stack className="chat-boxes">
        <div className="chats chat-header">
          <ArrowBackIcon onClick={() => navigate("/message")} />
          {/* {aCmpyDetails?.userDetail
          ?.filter((value) => value?.userId !== userDtls?.userId) // Filter out the current user
          .map((value, i) => ( */}
          <Stack sx={{ display: "contents" }}>
            <div>
              <Avatar
                alt="Logo"
                src={chatDetails?.profileImage || avatar}
                sx={{
                  width: "60px",
                  height: "60px",
                  marginRight: "8px",
                  bgcolor: "#f1f1f1",
                }}
              />
            </div>
            <div>
              <Typography
                // key={i}
                variant="h5"
                component="div"
                sx={{
                  width: "130px",
                  color: "#65558f",
                  fontWeight: "600",
                  wordBreak: "break-all",
                }}
              >
                {chatDetails?.username}
              </Typography>
              {/* <Typography variant="h7" component="div">
                {`Last  Seen ${conversationTimeDetails}`}
              </Typography> */}
            </div>
          </Stack>
          {/* // ))} */}
          <div className="report-icon">
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleReportClick}>Report</MenuItem>
            </Menu>
          </div>
        </div>
        <Divider />

        <div id="chat-container" className="chats-details">
          {messages?.map((text, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  text?.senderId === userDtls?.userId
                    ? "flex-end"
                    : "flex-start",
                width: "100%",
                margin: "5px 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: text?.senderId === userDtls?.userId ? "" : "15px",
                  bgcolor:
                    text?.senderId === userDtls?.userId ? "#001734" : "#6b5389",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                }}
              >
                <Stack>
                  {text?.content || text?.message ? (
                    <Typography sx={{ color: "#ffffff" }}>
                      {text?.content || text?.message}
                    </Typography>
                  ) : (
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        handlerImagePreview(text?.image);
                      }}
                      className={
                        "images-container " +
                        (text?.image?.length > 1 && "images-grid")
                      }
                    >
                      {text?.image?.length &&
                        text?.image?.map((ele) => {
                          return (
                            <img
                              src={ele}
                              alt="preview"
                              style={{
                                width: "100%",
                                height: "125px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          );
                        })}
                    </Box>
                  )}

                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      color: "#ffffff",
                    }}
                  >
                    {text?.formattedCreatedAt}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          ))}
        </div>
        {blockedMessageIndex === 0 ? (
          <Typography variant="body1" className="message-block">
            Message Blocked
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            {/* Image Upload Button */}
            <IconButton
              sx={{
                color: "#5f6368",
                marginRight: "8px",
                backgroundColor: "#f5f5f5",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
              }}
              aria-label="upload picture"
              component="label"
            >
              <ImageIcon />
              <input
                multiple
                hidden
                accept="images/*"
                type="file"
                onChange={(e) => {
                  handlerUploadImage(e);
                }} // Handle image upload
              />
            </IconButton>

            {/* Message Input Field */}
            <TextField
              variant="outlined"
              placeholder={image.length ? "" : "Type a message"}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update input state
              onKeyPress={(e) => {
                if (e.key === "Enter" && (message.trim() || image.length)) {
                  handleSendMessage(e);
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  paddingRight: "8px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ height: image.length ? "80px" : "40px" }}
                  >
                    {image?.length > 0 ? (
                      <Box sx={{ ml: 2, position: "absolute", left: "0px" }}>
                        {image?.map((ele) => {
                          return (
                            <img
                              src={ele}
                              alt="preview"
                              style={{
                                height: "40px",
                                borderRadius: "8px",
                              }}
                            />
                          );
                        })}
                      </Box>
                    ) : (
                      ""
                    )}
                    <IconButton
                      edge="end"
                      aria-label="send"
                      onClick={handleSendMessage}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Stack>
      {shoePreview && (
        <Preview
          {...{ ...previewDetails, open: shoePreview, close: setShowPreview }}
        />
      )}
    </>
  );
};

export default Chat;
