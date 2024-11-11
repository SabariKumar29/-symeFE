// import * as React from "react";
// import Card from "@mui/material/Card";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import sampleImg from "../../../assets/image/Media.png";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
// import CheckIcon from "@mui/icons-material/Check";
// import TodayIcon from "@mui/icons-material/Today";
// import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
// import MyButton from "../../MyButton";
// // import "./InfluencerOffers.css";
// import CarouselView from "./Carousel";
// import { formatDate } from "../../../utils/common";

// const PhotoView = ({ handleSelectOffersCard, data }) => {
//   return (
//     <>
//       {/* <Card
//         className="card-ctn"
//         margin={1}
//         sx={{
//           boxShadow: 3,
//           height: "468px",
//           width: "360px",
//           borderRadius: 2,
//           margin: 1,
//         }}
//       > */}
//       <Box
//         className="photo-view-ctn"
//         variant="contained"
//         component="section"
//         display="flex"
//         flexDirection={"column"}
//         alignItems="center"
//         p={"5px"}
//         sx={{
//           height: "468px",
//           p: 1,
//           borderRadius: "15px",
//           width: "100%",
//           bgcolor: "white.main",
//           overflow: "unset",
//         }}
//       >
//         <Box position={"relative"}>
//         <CarouselView
//           handleSelectOffersCard={handleSelectOffersCard}
//           imageList={data?.offerImages}
//         />
//         <div className="card-tag">
//           <IconButton
//             role="button"
//             sx={{
//               height: "32px",
//               padding: "8px",
//               bgcolor: "rgba(0, 0, 0,0)",
//             }}
//             color="white"
//             // className="SaveIcon btn"
//           >
//             <TurnedInNotIcon sx={{ color: "white" }} />
//           </IconButton>
//           <MyButton
//             sx={{
//               height: "32px",
//               boxShadow: 0,
//               padding: "8px",
//               bgcolor: "rgba(0, 0, 0,0)",
//             }}
//             //   color="light1"
//             startIcon={<SentimentVerySatisfiedIcon />}
//             //   className="btn"
//           >
//             Spa & Luxury
//           </MyButton>
//           <MyButton
//             //   className="btn"
//             sx={{
//               height: "32px",
//               boxShadow: 0,
//               padding: "8px",
//               bgcolor: "rgba(0, 0, 0,0)",
//             }}
//             //   color="light1"
//             startIcon={<TodayIcon color="primary" />}
//           >
//             <Typography fontWeight=" 700" variant="body1" color="primary">
//               {`Due ${formatDate(
//                 data?.availableDates?.from,
//                 "DD/MM"
//               )}-${formatDate(data?.availableDates?.to, "DD/MM")}`}
//             </Typography>
//           </MyButton>
//         </div>
//         <div className="card-content">
//           <Typography
//             className="CardTitle"
//             fontWeight=" 700"
//             variant="body1"
//             color="text.secondary"
//           >
//             {data?.title}
//           </Typography>

//           <div style={{ display: "flex", gap: 10 }}>
//             <MyButton
//               //   className="btn"
//               sx={{ height: "32px" }}
//               variant="outlined"
//             >
//               {data?.influencerDetails?.username}
//             </MyButton>
//             <MyButton
//               //   className="btn"
//               sx={{ height: "32px" }}
//               color="blueLight"
//             >{`0/5 booked`}</MyButton>
//           </div>
//         </div>
//         {/* <div
//             className="span2"
//             style={{ display: "flex", gap: 5, justifyContent: "space-evenly" }}
//           > */}
//         <MyButton
//           // className="checkIcon btn"
//           color="secondary"
//           sx={{
//             borderRadius: 4,
//             fontWeight: 700,
//             height: "32px",
//             width: "100%",
//             margin: "10px",
//           }}
//           startIcon={<CheckIcon />}
//         >
//           {/* <span className="checkIcon-text"> */}
//           Accept offer
//           {/* </span> */}
//         </MyButton>
//         {/* </div> */}
//         </Box>
//       </Box>
//       {/* </Card> */}
//     </>
//   );
// };

// export default PhotoView;
import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import sampleImg from "../../../assets/image/Media.png";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import CheckIcon from "@mui/icons-material/Check";
import TodayIcon from "@mui/icons-material/Today";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MyButton from "../../MyButton";
// import "./InfluencerOffers.css";
import CarouselView from "./Carousel";
import { formatDate } from "../../../utils/common";
import { useSelector } from "react-redux";
import { useSaveOfferMutation } from "../../../services/apiService/userApiService";
import toaster from "../../Toaster/toaster";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const PhotoView = ({
  handleSelectOffersCard,
  data,
  handlerFetchOffers,
  handlerUpdateBookingStatus,
  isSimilarView,
  isSavedOffer,
}) => {
  const navigate = useNavigate(); // To navigate
  const { userDtls } = useSelector((state) => state?.auth);
  const [saveOffer] = useSaveOfferMutation();

  const handlerSaveOffer = async (e) => {
    try {
      e?.stopPropagation();
      e?.preventDefault();
      const payload = {
        offer_id: data?._id,
        // newStatus: "offeredToInfluencer",
        user_id: userDtls?.userId,
      };
      const response = await saveOffer(payload).unwrap();
      if (response?.success) {
        // handlerFetchOffers(true);
        toaster("info", response?.message);
      } else {
        toaster("info", response?.message);
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to save offer:", err);
        toaster("error", "Something went wrong");
      }
    }
  };
  return (
    <Box
      // onClick={(e) => {
      //   navigate(`/offers/${data?._id}`);
      // }}
      variant="contained"
      component="section"
      display="flex"
      flexDirection={"column"}
      p={"5px"}
      sx={{
        boxShadow: 2,
        p: 1,
        height: "468px",
        minWidth: "360px",
        borderRadius: "15px",
        margin: "5px",
        bgcolor: "white.main",
        overflow: "unset",
        position: "relative",
      }}
    >
      {/* Top Section - Image with overlay icons */}
      <Box sx={{ height: "88%", position: "relative" }}>
        <Box
          sx={{
            // height: "80%",
            width: "100%",
          }}
        >
          <CarouselView
            handleSelectOffersCard={handleSelectOffersCard}
            imageList={data?.offerImages}
          />
          {/* Save icon and buttons on top */}
          <Box
            // className="card-tag"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              bgcolor: "rgba(0, 0, 0, 0.2)",
              zIndex: 11,
              // backdropFilter: "blur(1px)",
              // background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* {!isSimilarView && ( */}
            <Box>
              <IconButton
                role="button"
                sx={{
                  height: "32px",
                  padding: "8px",
                  bgcolor: "rgba(0, 0, 0,0)",
                }}
                color="white"
              >
                <InfoOutlinedIcon
                  sx={{ color: "white" }}
                  onClick={() => {
                    navigate(`/offers/${data?._id}`);
                  }}
                />
              </IconButton>
            </Box>
            {/* )} */}
            <Box>
              <IconButton
                role="button"
                sx={{
                  height: "32px",
                  padding: "8px",
                  bgcolor: "rgba(0, 0, 0,0)",
                }}
                color="white"
                onClick={(e) => handlerSaveOffer(e)}
              >
                {isSavedOffer ? (
                  <TurnedInIcon sx={{ color: "white" }} />
                ) : (
                  <TurnedInNotIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </Box>
            {!isSimilarView && (
              <Box sx={{ display: "flex", gap: "12px" }}>
                <MyButton
                  sx={{
                    border: "2px solid #fffefebf",
                    borderRadius: "8px",
                    height: "32px",
                    boxShadow: 0,
                    padding: "2px",
                    bgcolor: "rgba(0, 0, 0,0)",
                  }}
                  startIcon={<SentimentVerySatisfiedIcon />}
                >
                  Spa & Luxury
                </MyButton>
                <MyButton
                  sx={{
                    border: "2px solid white",
                    borderRadius: "8px",
                    height: "32px",
                    boxShadow: 0,
                    padding: "2px",
                    bgcolor: "rgba(0, 0, 0,0)",
                  }}
                  //   color="light1"
                  startIcon={<TodayIcon color="white" />}
                >
                  <Typography fontWeight=" 700" variant="body1" color="white">
                    {`Due ${formatDate(
                      data?.availableDates?.from,
                      "DD/MM"
                    )}-${formatDate(data?.availableDates?.to, "DD/MM")}`}
                  </Typography>
                </MyButton>
              </Box>
            )}
          </Box>
        </Box>

        {/* Middle Section - Offer Title */}
        <Box sx={{ height: "20%", p: 1 }}>
          <Typography
            className="CardTitle"
            fontWeight=" 700"
            variant="body1"
            color="text.secondary"
          >
            {data?.title}
          </Typography>
          {/* Bottom Section - Info and Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            {/* Left: Company Info */}
            <MyButton
              className="btn"
              sx={{ height: "32px" }}
              variant="outlined"
            >
              {data?.categories?.[0]?.value}
            </MyButton>
            {/* Right: Booking Info */}
            <MyButton className="btn" sx={{ height: "32px" }} color="blueLight">
              {data?.spots?.booked}/{data?.spots?.availableSpots} Booked
            </MyButton>
          </Box>
        </Box>
      </Box>

      {/* Button Section */}
      {!isSimilarView && (
        <Box
          sx={{ height: "12%", p: 1, textAlign: "center" }}
          className="checkIcon btn"
        >
          <MyButton
            onClick={(e) => handlerUpdateBookingStatus(e, data)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: "20px", width: "100%" }}
            startIcon={<CheckIcon />}
            disabled={!(data?.offerStatus === "accept")}
          >
            {data?.offerStatus || "test"}
          </MyButton>
        </Box>
      )}
    </Box>
  );
};

export default PhotoView;
