import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import sampleImg from "../../assets/image/Media.png";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import CheckIcon from "@mui/icons-material/Check";
import TodayIcon from "@mui/icons-material/Today";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MyButton from "../MyButton";
import "./MyCard.css";
import { formatDate } from "../../utils/common";

const MyCard = (props) => {
  const { data } = props;
  return (
    <>
      <Card
        className="card-ctn"
        sx={{
          boxShadow: 3,
          height: props.height || "100%",
          width: props?.width || "100%",
        }}
      >
        <Box
          variant="contained"
          component="section"
          display="flex"
          alignItems="center"
          gap={4}
          p={1}
          sx={{
            p: 2,
            borderRadius: "15px",
            // width: "100%",
            bgcolor: "white.main",
          }}
        >
          <CardMedia
            className="CardMedia"
            component="img"
            alt="green iguana"
            height={props.height ? "" : "80px"}
            width={props.width ? "" : "80px"}
            image={sampleImg}
            sx={{ width: "80px", boxShadow: 3, borderRadius: "12px" }}
          />
          <CardContent>
            <Typography
              fontWeight=" 700"
              variant="body1"
              color="text.secondary"
            >
              Relaxing weekend break
            </Typography>
          </CardContent>
          <CardActions>
            <Box
              variant="contained"
              component="section"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={4}
              p={2}
              sx={{
                p: 2,
                borderRadius: "15px",
                bgcolor: "white.main",
              }}
            >
              <MyButton variant="outlined">Company</MyButton>
              <MyButton color="blueLight">{`0/5 booked`}</MyButton>
              <MyButton
                color="light1"
                startIcon={<SentimentVerySatisfiedIcon />}
              >
                Spa & Luxury
              </MyButton>
              <MyButton
                color="light1"
                startIcon={<TodayIcon color="primary" />}
              >
                <Typography fontWeight=" 700" variant="body1" color="primary">
                  {`Due ${formatDate(
                    data?.availableDates?.from,
                    "DD/MM"
                  )}-${formatDate(data?.availableDates?.to, "DD/MM")}`}
                </Typography>
              </MyButton>
            </Box>
            <MyButton
              color="secondary"
              sx={{ borderRadius: 4, fontWeight: 700 }}
              startIcon={<CheckIcon />}
            >
              Accept
            </MyButton>
            <IconButton color="primary">
              <TurnedInNotIcon />
            </IconButton>
          </CardActions>
        </Box>
      </Card>
    </>
  );
};

export default MyCard;
