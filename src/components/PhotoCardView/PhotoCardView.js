import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import CheckIcon from "@mui/icons-material/Check";
import TodayIcon from "@mui/icons-material/Today";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MyButton from "../MyButton";
import CarouselView from "../Influencer/Offers/Carousel";
import { formatDate } from "../../utils/common";

const PhotoCardView = ({
  data,
  handleSelectOffersCard,
  height = "100%",
  width = "360px",
}) => {
  return (
    <>
      <Card
        className="card-ctn"
        margin={1}
        sx={{
          // boxShadow: 3,
          height: height,
          width: width,
          borderRadius: 2,
          margin: 1,
          overflow: "unset",
        }}
      >
        <Box
          className="photo-view-ctn"
          variant="contained"
          component="section"
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          p={"5px"}
          sx={{
            // height: "468px",
            p: 1,
            borderRadius: "15px",
            width: "100%",
            bgcolor: "white.main",
            overflow: "unset",
          }}
        >
          <CarouselView
            imageList={data?.offerImages}
            handleSelectOffersCard={handleSelectOffersCard}
          />
          <div className="card-tag">
            <IconButton
              role="button"
              sx={{
                height: "32px",
                // padding: "8px",
                bgcolor: "rgba(0, 0, 0,0)",
              }}
              color="white"
            >
              <TurnedInNotIcon sx={{ color: "white" }} />
            </IconButton>
            <MyButton
              sx={{
                height: "32px",
                boxShadow: 0,
                padding: "8px",
                bgcolor: "rgba(0, 0, 0,0)",
              }}
              startIcon={<SentimentVerySatisfiedIcon />}
            >
              Spa & Luxury
            </MyButton>
            <MyButton
              sx={{
                height: "32px",
                boxShadow: 0,
                padding: "8px",
                bgcolor: "rgba(0, 0, 0,0)",
              }}
              startIcon={<TodayIcon color="primary" />}
            >
              <Typography fontWeight=" 700" variant="body1" color="primary">
                {`Due ${formatDate(
                  data?.availableDates?.from,
                  "DD/MM"
                )}-${formatDate(data?.availableDates?.to, "DD/MM")}`}
              </Typography>
            </MyButton>
          </div>
          <div className="card-content">
            <Typography
              className="CardTitle"
              fontWeight=" 700"
              variant="body1"
              color="text.secondary"
            >
              Offer title can take up some
            </Typography>

            {/* <div style={{ display: "flex", gap: 10 }}>
              <MyButton sx={{ height: "32px" }} variant="outlined">
                Company
              </MyButton>
              <MyButton
                sx={{ height: "32px" }}
                color="blueLight"
              >{`0/5 booked`}</MyButton>
            </div> */}
          </div>
          {/* <MyButton
            color="secondary"
            sx={{
              borderRadius: 4,
              fontWeight: 700,
              height: "32px",
              width: "100%",
              margin: "10px",
            }}
            startIcon={<CheckIcon />}
          >
            Accept offer
          </MyButton> */}
        </Box>
      </Card>
    </>
  );
};

export default PhotoCardView;
