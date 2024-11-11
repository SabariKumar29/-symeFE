import * as React from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import "./Message.css";
import logosyme from "../../assets/image/logosyme.png";
import company from "../../assets/image/company.jpg";
import influencer from "../../assets/image/influencer.jpg";
import wfBadge from "../../assets/image/wfBadge.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyButton from "../../components/MyButton";
import Divider from "@mui/material/Divider";
import chatslogo from "../../assets/image/chatslogo.png";
import Avatar from "@mui/material/Avatar";

const initialData = [
  {
    title: "SYME",
    hours: "2 hours ago",
    partOfSpeech: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor amet",
    definition: "Companies you might like.",
    image: influencer,
    read: false, // Add the read flag
  },
  {
    title: "Another",
    hours: "3 hours ago",
    partOfSpeech: "the occurrence and development of events by .",
    definition: "the occurrence ",
    image: company,
    read: true, // Add the read flag
  },
  {
    title: "SYME",
    hours: "2 hours ago",
    partOfSpeech: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor amet",
    definition: "Companies you might like.",
    image: logosyme,
    read: true, // Add the read flag
  },
  {
    title: "Another",
    hours: "3 hours ago",
    partOfSpeech: "the occurrence and development of events by .",
    definition: "the occurrence ",
    image: influencer,
    read: true, // Add the read flag
  },
  {
    title: "SYME",
    hours: "2 hours ago",
    partOfSpeech: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor amet",
    definition: "Companies you might like.",
    image: company,
    read: true, // Add the read flag
  },
  {
    title: "Another",
    hours: "3 hours ago",
    partOfSpeech: "the occurrence and development of events by .",
    definition: "the occurrence ",
    image: logosyme,
    read: false, // Add the read flag
  },
];
const initialData2 = [
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
    time: "2 hours ago",
  },
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
    time: "3 hours ago",
  },
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
    time: "2 hours ago",
  },
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
    time: "3 hours ago",
  },
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  },
  {
    image: wfBadge,
    name: "company",
    title: "Booking title can take up some space up here,so it will fold,",
    text: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  },
];
const textArray = [
  "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
  "Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.Lorem ipsum sit dolor amet, lorem ipsum sit dolor ame.",
];



const OutlinedCard = () => {
  const [conversation, setConversation] = React.useState(initialData2);
  const [isCompany, setIsCompany] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState(initialData);
  const [value, setValue] = React.useState(0);
  const [aCmpyDetails, setCmpyDetails] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [blockedMessageIndex, setBlockedMessageIndex] = React.useState(null);

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
    setBlockedMessageIndex(0); // Block the first message
    setAnchorEl(null);
  };

  const handleCardClick = (index) => {
    setNotificationList((prevList) =>
      prevList.map((item, i) => (i === index ? { ...item, read: true } : item))
    );
  };

  const handleClickConversations = (arrayDetails) => {
    setIsCompany(true);
    setCmpyDetails(arrayDetails);
  };

  useEffect(() => {
    // Handle incoming messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div className="message-header">
      <Box sx={{ width: "100%" }} className="content-box">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="web-view-tabs"
        >
          <TabList
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab sx={{ textTransform: "capitalize" }} value="Conversations" />
            <Tab sx={{ textTransform: "capitalize" }} value="Notifications" />
          </TabList>
        </Box>
        <TabPanel value="Conversations" index={0} className="content-tab">
          {isCompany ? (
            <Box className="chat-boxes">
              <div className="chats chat-header">
                <ArrowBackIcon onClick={() => setIsCompany(false)} />
                <div>
                  <Typography variant="h5" component="div">
                    {aCmpyDetails?.name}
                  </Typography>
                  <Typography variant="h7" component="div">
                    {aCmpyDetails?.title}
                  </Typography>
                </div>
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
              <div className="chats-details">
                {textArray.map((text, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        index % 2 === 0 ? "flex-start" : "flex-end",
                      width: "100%", // Ensure the box takes the full width
                      margin: "5px 0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: index % 2 === 0 ? "#f1f1f1" : "#ffffff", // Adjust background color
                        padding: "10px",
                        borderRadius: "10px",
                        maxWidth: "70%", // Limit the width of the text bubble
                      }}
                    >
                      {index % 2 === 0 && (
                        <Avatar
                          alt="Logo"
                          src={chatslogo}
                          sx={{
                            marginRight: "8px",
                            width: "60px",
                            height: "60px",
                            bgcolor: "#f1f1f1",
                          }}
                        />
                      )}
                      <p>{text}</p>
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
                    <input hidden accept="image/*" type="file" />
                  </IconButton>
                  <TextField
                    variant="outlined"
                    placeholder="Type message"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "50px",
                        paddingRight: "8px",
                        paddingLeft: "8px",
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#a0a0a0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3f51b5",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            aria-label="send message"
                            edge="end"
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <>
              <div className="btn-conversation">
                <MyButton
                  sx={{
                    width: "100px",
                    borderRadius: "22px",
                    borderColor: "text.secondary",
                  }}
                >
                  Current
                </MyButton>
                <MyButton
                  sx={{
                    width: "100px",
                    borderRadius: "22px",
                    borderColor: "text.secondary",
                  }}
                  variant="outlined"
                >
                  Past
                </MyButton>
              </div>
              {conversation.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    marginBottom: 2,
                    backgroundColor: item.read ? "white" : "#fef7ff", // Conditionally set background color
                  }}
                  className="card-header"
                  onClick={() => handleClickConversations(item)} // Add onClick conversation
                >
                  <div className="Conversations">
                    <img
                      className="image-notification"
                      component="img"
                      src={item.image}
                      alt={item.title}
                    />
                    <div className="typo-Conversations">
                      <div className="notification-title">
                        <Typography variant="h5" component="div">
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                          className="notification-hours"
                        >
                          {item.time}
                        </Typography>
                      </div>
                      <Typography variant="body2">{item.definition}</Typography>
                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {item.text}
                      </Typography>
                    </div>
                  </div>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                    className="web-hours"
                  >
                    {item.time}
                  </Typography>
                </Card>
              ))}
            </>
          )}
        </TabPanel>
        <TabPanel value="Notifications" index={1} className="content-tab">
          {notificationList.map((item, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: 2,
                backgroundColor: item.read ? "white" : "#fef7ff", // Conditionally set background color
              }}
              className="card-header"
              onClick={() => handleCardClick(index)} // Add onClick handler
            >
              <div className="notification">
                <img
                  className="image-notification"
                  component="img"
                  src={item.image}
                  alt={item.title}
                />
                <div className="typo-notification">
                  <div className="notification-title">
                    <Typography variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                      className="notification-hours"
                    >
                      {item.hours}
                    </Typography>
                  </div>
                  <Typography variant="body2">{item.definition}</Typography>
                  <Typography color="text.secondary">
                    {item.partOfSpeech}
                  </Typography>
                </div>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                  className="web-hours"
                >
                  {item.hours}
                </Typography>
              </div>
            </Card>
          ))}
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
            <Tab
              label="Conversations"
              value="Conversations"
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Notifications"
              value="Notifications"
              sx={{ textTransform: "capitalize" }}
            />
          </Tabs>
        </Box>
      </Box>
    </div>
  );
};

export default OutlinedCard;
