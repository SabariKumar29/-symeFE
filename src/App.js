import React, { useEffect, useState } from "react";
import { Route, Navigate, Routes, Outlet } from "react-router-dom";
import Login from "./pages/login/Login";
import LandingPage from "./pages/landing/LandingPage";
import TikTokRedirect from "./pages/login/loginWithSocial/TikTokRedirect";
import InstagramRedirect from "./pages/login/loginWithSocial/InstagramRedirect";
import AddLocation from "./pages/dashboard/Account/AddLocation";
import ProfileDetails from "./pages/dashboard/Account/ProfileDetails";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, defaultTheme, darkTheme } from "./style/theme";
import Offers from "./pages/Offers/Offers";
import Message from "./components/messages/Message";
import Setting from "./components/setting/Setting";
import Bookings from "./components/bookings/Bookings";
import MainLayout from "./pages/Mainlayout/MainLayout";
import Account from "./components/setting/AccountSetting";
import MyCard from "./components/Card/MyCard";
import { useSelector } from "react-redux";
import TestRedirect from "./TestRedirect/TestRedirect";
import OfferDetails from "./components/OfferDetails/OfferDetails";
import OfferView from "./pages/OfferView/OfferView";
import LocationAutoComplete from "./components/LocationAutoComplete/LocationAutoComplete";
import Chat from "./components/messages/Chat";
import CircularProgress from "@mui/material/CircularProgress";
import Users from "./pages/admin/Users/Users";
import SignIn from "./pages/login/SignIn";

import "./style/CommonStyleNew.css";
const ProtectedRoute = ({ auth, redirectPath = "/signIn" }) => {
  console.log(auth);
  if (!auth) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
const App = () => {
  const { isLoading } = useSelector((state) => state.auth);
  // const [user, setUser] = useRecoilState(meAtom);
  const { isLoggedIn, userType } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);
  const [theme] = useState("default");
  // const sessionId = getSessionId();
  const objTheme = {
    light: lightTheme,
    default: defaultTheme,
    dark: darkTheme,
  };
  return (
    <ThemeProvider theme={objTheme[theme]}>
      {isLoading && <div className="spinner">{<CircularProgress />}</div>}

      <Routes>
        <Route index element={<LandingPage />} />
        {/* <Route path="test" element={<TestRedirect />} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* <Route path="tiktok-redirect" element={<TikTokRedirect />} /> */}
        {/* <Route path="instagram-redirect" element={<InstagramRedirect />} /> */}
        {/* <Route element={<ProtectedRoute auth={!sessionId ? false : true} />}> */}
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        {/* </Route> */}
        {/* <Route path="location" element={<LocationAutoComplete />} /> */}
        {/* <Route path="profile" element={<ProfileDetails />} /> */}
        <Route path="landing-page" element={<LandingPage />} />
        <Route path="*" element={<SignIn />} />
        <Route path="signIn" element={<SignIn />} />
        <Route path="signUp" element={<SignIn />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute auth={isLoggedIn} />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="offers" element={<Offers />} />
            <Route path="offers/:offerId" element={<OfferView />} />
            <Route path="message" element={<Message />} />{" "}
            <Route path="chat/:chatId" element={<Chat />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="settings" element={<Setting />} />
            <Route path="accounts" element={<Account />} />
            {userType === "admin" && (
              <Route path="/users" element={<Users />} />
            )}
          </Route>
        </Route>
        <Route path="card" element={<MyCard />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
