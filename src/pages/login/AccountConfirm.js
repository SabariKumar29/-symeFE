import React, { useRef, useEffect, useState } from "react";
import "./Account.css";
import { Box, Stack, Typography } from "@mui/material";
import "../../style/CommonStyle.css";
import MyButton from "../../components/MyButton";
import { useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../store/Slicers/authSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual ,Navigation ,HashNavigation } from 'swiper/modules';
import 'swiper/css';         // Basic Swiper styles


const AccountConfirm = ({ name = "John" }) => {
  const { userDtls } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imgList = [
    {
      text: "Connect with your social media account",
      bg: "#e8def8",
      url: "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
      text: "Create a profile that stands out",
      bg: "#65558f",
      url: "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    {
      text: "Start your membership and connect with companies",
      bg: "#B0DCFF",
      url: "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    {
      text: "Take part in exclusive offers",
      bg: "#79747e",
      url: "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
  ];
  const navigateToOffer = () => {
    dispatch(setIsLoggedIn(true));
    navigate("/offers");
  };
  /**
   * Image List view
   * @returns jsx elements
   */
  const ImageListView = () => {
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleWheel = (e) => {
        if (e.shiftKey) {
          e.preventDefault();
          const scrollAmount = e.deltaY > 0 ? 1 : -1;
          setIndex(
            (prevIndex) =>
              (prevIndex + scrollAmount + imgList.length) % imgList.length
          );
        }
      };

      const container = containerRef.current;

      if (container) {
        container.addEventListener("wheel", handleWheel);
      }

      return () => {
        if (container) {
          container.removeEventListener("wheel", handleWheel);
        }
      };
    }, []);

    return (
      <Box
        ref={containerRef}
        width={"320px"}
        height={"400px"}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollBehavior: "smooth",
        }}
        display={"flex"}
      >
         <Swiper className="swiperarrow" modules={[Virtual ,Navigation, HashNavigation]}  spaceBetween={4} slidesPerView={1}  navigation={true} hashNavigation={true} virtual>
          {imgList?.map((ele, index) => {
             
            return (
              <SwiperSlide key={index} virtualIndex={index}>
              <Box key={index} className="img-ctn" sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  
                }}>
                <Box
                  color={"primary"}
                  sx={{ bgcolor: ele?.bg + "80" }}
                  className="syme-text "
                >
                  <Typography
                    padding={1}
                    textAlign="center"
                    letterSpacing={"-0.01em"}
                    fontSize={24}
                    fontWeight={700}
                  >
                    SYME
                  </Typography>
                </Box>
                <img
                  key={index}
                  src={ele?.url}
                  height="100%"
                  width="100%"
                  alt="loading"
                  className="welcome-page-img"
                />
                <Box
                  sx={{ color: "white.main", position: "absolute", bottom: 0 }}
                >
                  <Typography
                    padding={1}
                    textAlign="left"
                    letterSpacing={"-0.01em"}
                    fontSize={32}
                    fontWeight={700}
                  >
                    Step {index + 1}
                  </Typography>
                  <Typography
                    padding={1}
                    textAlign="left"
                    letterSpacing={"-0.01em"}
                    fontSize={24}
                    fontWeight={700}
                  >
                    {ele?.text}
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    );
  };

  return (
    <Box>
      <Typography
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontSize={24}
        fontWeight={700}
        className="account-title"
      >
        {`Welcome, ${name || userDtls?.username}!`}
      </Typography>
      <ImageListView />
      <Stack
        marginTop={1}
        direction={"row"}
        gap={2}
        marginBottom={1}
        justifyContent={"center"}
      >
        <>
          <MyButton
            // sx={{ borderRadius: 10 }}
            onClick={navigateToOffer}
          >
            Browse offers
          </MyButton>
          <MyButton
            // sx={{ borderRadius: 10 }}
            onClick={navigateToOffer}
          >
            Complete profile
          </MyButton>
        </>
      </Stack>
    </Box>
  );
};

export default AccountConfirm;
