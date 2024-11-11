import React, { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InboxIcon from "@mui/icons-material/Inbox";
import TuneIcon from "@mui/icons-material/Tune";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import defaultProfileImg from "../../assets/image/defaultProfileImg.png";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import "./Sidebar.css";
import logosyme from "../../assets/image/logosyme.png";
import { Button, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setClearUserDtls,
  setUserDetails,
} from "../../store/Slicers/authSlice";
import { useGetNotificationListMutation } from "../../services/apiService/userApiService";
import LogoutIcon from "@mui/icons-material/Logout";
import { setMessageCount } from "../../store/Slicers/messageSlice";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/**
 * @returns open or close
 * */
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = ({ open, handleDrawerToggle }) => {
  const dispatch = useDispatch(); //here used to dispatch the notification unread message and logout
  const theme = useTheme();
  const navigate = useNavigate(); //navigate to the path of the sidebar
  const location = useLocation(); //for highlight the path
  const [isReadList, setIsReadList] = React.useState([]); // get notification list
  const { messageCount } = useSelector((state) => state?.message); //get message count from redux
  const { userDtls } = useSelector((state) => state?.auth); //get user details from redux
  const [getNotification] = useGetNotificationListMutation(); //api for get notification

  /**
   * logout the user
   * @returns empty
   * */
  const handleLogout = () => {
    dispatch(setClearUserDtls());
  };
  /**
   * navigate to the path
   * @returns path
   * */
  const handleNavigation = (path) => {
    navigate(path);
  };

  /**
   * api call for get notification
   * @returns data
   * */
  const notificationData = async () => {
    try {
      const response = await getNotification({
        id: userDtls?.userId,
        // id:'3256686d-fdcc-4a45-b2ec-4471f13a6d92',   //for testing
        filter: { sort: "createdAt" },
      }).unwrap();

      if (response?.data?.length) {
        const unreadMessages = response?.data?.filter(
          (message) => !message.isRead
        );
        dispatch(setMessageCount(unreadMessages?.length || ""));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // call the notification funtion api
  useEffect(() => {
    notificationData();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#65558fad" }}>
      <CssBaseline />
      <Drawer
        className="side-bar-for-web"
        variant="permanent"
        open={open}
        sx={{
          color: "white",
          bgcolor: "#65558fad", // Replace with your desired background color
          "& .MuiDrawer-paper": {
            bgcolor: "#65558fad", // Ensure the paper inside the drawer also has the same background color
          },
        }}
      >
        {/* header icon for shirnk */}
        <DrawerHeader
          sx={{ bgcolor: "secondary.soft", color: "white" }}
          onClick={handleDrawerToggle}
          className="toggle-bar"
        >
          <IconButton>
            {open ? (
              <div className="icon-syme">
                <img src={logosyme} alt="SYME" className="logo-img" />
                <Typography sx={{ color: "#ffffff" }}>SYME</Typography>
              </div>
            ) : (
              <MenuIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ background: "white" }} />
        {/* sidebar choose path */}
        <List className="component-list" sx={{ color: "white" }}>
          {[
            {
              text: "Home",
              icon: <HomeOutlinedIcon />,
              path: "/home",
            },
            {
              text: "Offers",
              icon: <LocalOfferOutlinedIcon />,
              path: "/offers",
            },
            {
              text: "Bookings",
              icon: <EventOutlinedIcon />,
              path: "/bookings",
            },
            {
              text: "Message",
              icon: <InboxIcon />,
              path: "/message",
              badge: messageCount || "",
            },
            { text: "Settings", icon: <TuneIcon />, path: "/settings" },
            userDtls?.type === "admin" && {
              text: "Users",
              icon: <GroupOutlinedIcon />,
              path: "/users",
            },
          ].map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", color: "white" }}
            >
              <ListItemButton
                className={`list-item-button ${
                  location.pathname.includes(item?.path) ? "active" : "inactive"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon
                  className="itemicon"
                  sx={{
                    color: "#ffffff",
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                  {messageCount > 0 && (
                    <Badge
                      sx={{ marginLeft: 1 }}
                      badgeContent={item.badge}
                      color="warning"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    ></Badge>
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ background: "white" }} />

        {/* For logout and help, term is there  */}
        <List className="side-list-color">
          {[
            {
              text: "Help",
              icon: <LiveHelpOutlinedIcon />,
              // path: "",
            },
            {
              text: "Terms",
              icon: <ReceiptLongOutlinedIcon />,
              // path: "",
            },
            {
              text: "Logout",
              icon: <LogoutIcon />,
            },
          ].map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", color: "white" }}
            >
              <ListItemButton
                onClick={item.text === "Logout" ? handleLogout : undefined}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  className="itemicon"
                  sx={{
                    color: "#ffffff",
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item?.icon}
                  {/* Add icons if needed */}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* For sidebar bottom profile */}
        <Stack
          width="100%"
          height="50px"
          margin="auto 0 15px 7px"
          direction="row"
          alignItems="center"
          onClick={() => handleNavigation("/accounts")}
          sx={{ cursor: "pointer" }}
        >
          <Box
            marginLeft={open ? 1 : 0}
            width="51px"
            height="100%"
            borderRadius="50%"
            objectFit="cover"
          >
            <img
              src={userDtls?.profileImage || defaultProfileImg}
              alt="loading"
              style={{
                height: "50px",
                margin: "auto",
                width: "50px",
                borderRadius: "50%",
              }}
            />
          </Box>
          {/* sidebar is close text will be hide */}
          <ListItem sx={{ display: !open && "none" }}>
            <ListItemText
              primary={userDtls?.username}
              primaryTypographyProps={{
                style: {
                  color: "white",
                  fontWeight: "500",
                },
              }}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItem>
        </Stack>
      </Drawer>

      {/**
       *RENDER THIS WHEN MOBILE VIEW
       */}
      <div className="mobile-icons">
        <IconButton
          onClick={() => handleNavigation("/home")}
          sx={{ width: "80px" }}
        >
          <Stack
            sx={{
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              height: "30px",
              fontSize: "12px",
            }}
          >
            <HomeOutlinedIcon />
            <Typography sx={{ color: "#ffffff" }}>Home</Typography>
          </Stack>
        </IconButton>
        {/* functionality for OFFERS */}
        <IconButton
          onClick={() => handleNavigation("/offers")}
          sx={{ width: "80px" }}
        >
          <Stack
            sx={{
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              height: "30px",
              fontSize: "12px",
            }}
          >
            <LocalOfferOutlinedIcon />
            <Typography sx={{ color: "#ffffff" }}>Offer</Typography>
          </Stack>
        </IconButton>
        {/* functionality for BOOKING */}
        <IconButton
          onClick={() => handleNavigation("/bookings")}
          sx={{ width: "80px" }}
        >
          <Stack
            sx={{
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              height: "30px",
              fontSize: "12px",
            }}
          >
            <EventOutlinedIcon />
            <Typography sx={{ color: "#ffffff" }}>Bookings</Typography>
          </Stack>
        </IconButton>
        {/* functionality for MESSAGE */}
        <IconButton
          onClick={() => handleNavigation("/message")}
          sx={{ width: "80px" }}
        >
          <Stack
            sx={{
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              height: "30px",
              fontSize: "12px",
            }}
          >
            {/* {messageCount && (
              <Badge
                sx={{ marginLeft: 2 }}
                badgeContent={messageCount}
                color="warning"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              ></Badge> */}
            {/* )} */}
            <InboxIcon />
            <Typography sx={{ color: "#ffffff" }}>Messages</Typography>
          </Stack>
        </IconButton>
        {/* functionality for ACCOUNT */}
        <IconButton
          onClick={() => handleNavigation("/settings")}
          sx={{ width: "80px" }}
        >
          <Stack
            sx={{
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              height: "30px",
              fontSize: "12px",
            }}
          >
            <AccountCircleIcon />
            <Typography sx={{ color: "#ffffff" }}>Account</Typography>
          </Stack>
        </IconButton>
      </div>
    </Box>
  );
};

export default Sidebar;
