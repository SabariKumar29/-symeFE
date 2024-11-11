import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import influencerCardIcon from "../../../assets/image/InfluencerCardIcon.png";
import MyButton from "../../MyButton";
import "./CompanyOffers.css";
import { IconButton, Stack } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import TodayIcon from "@mui/icons-material/Today";
import { formatDate } from "../../../utils/common";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

const CompanyOffersList = (props) => {
  const {
    data,
    handleOffer,
    handlerEditOffer,
    handlerDuplicateOffer,
    isAdmin,
  } = props;
  return (
    <>
      <Card
        onClick={() => handleOffer(data)}
        className="card-ctn"
        // margin={1}
        sx={{
          // boxShadow: 3,
          width: "100%",
          padding: "6px 16px",
          border: 0,
          boxShadow: 0,
          // borderRadius: 3,
          overflow: "unset",
        }}
      >
        <Box
          className="list-view-ctn"
          variant="contained"
          component="section"
          display="flex"
          alignItems="center"
          gap={1}
          p={"5px"}
          sx={{
            p: 1,
            borderRadius: "15px",
            width: "100%",
            bgcolor: "white.main",
            boxShadow: 3,
          }}
        >
          <CardMedia
            // onClick={() => handleOffer(data)}
            className="CardMedia"
            component="img"
            alt="green iguana"
            height={"80px"}
            width={"80px"}
            image={data?.offerImages[0]}
            sx={{ width: "80px", boxShadow: 3, borderRadius: "12px" }}
          />
          <Typography
            // onClick={() => handleOffer(data)}
            className="textEllipsis CardTitle"
            width={"230px"}
            color={"gray.main"}
            fontWeight=" 700"
            variant="body1"
          >
            {data?.title}
          </Typography>

          {data?.requestToBusiness?.length > 0 && (
            <MyButton
              onClick={() => handleOffer(data)}
              className="btn action-btn profileBtnCtn "
              color="secondary"
              sx={{
                height: "48px",
                Padding: "8px",
                borderRadius: "30px",
                // width: "270px",
              }}
            >
              <div className="profileBtn">
                <img
                  className="imageIcon"
                  src={influencerCardIcon}
                  alt="loading"
                ></img>
                <Stack direction={"row"} gap={1}>
                  <Typography
                    className="textEllipsis userName"
                    width={"100px"}
                    color={"gray.main"}
                    fontWeight=" 700"
                  >
                    {data?.requestToBusiness[0]?.username}
                  </Typography>
                  <Typography
                    className="textEllipsis"
                    width={"130px"}
                    color={"gray.main"}
                  >
                    {data?.requestToBusiness[0]?.email}
                  </Typography>
                  {data?.requestToBusiness?.length - 1 > 0 && (
                    <Stack
                      direction={"row"}
                      color={"primary.main"}
                      textAlign={"center"}
                    >
                      <GroupAddOutlinedIcon />
                      <span>{`${data?.requestToBusiness?.length - 1}`}</span>
                    </Stack>
                  )}
                </Stack>

                {/* <MyButton
                //   className="btn"
                color="white"
                sx={{ height: "32px", padding: "8px" }}
                startIcon={<GroupAddIcon />}
              >
                {2}
              </MyButton> */}
              </div>
            </MyButton>
          )}
          <MyButton
            className="btn list-btn"
            sx={{ height: "32px", boxShadow: 0 }}
            color="light1"
            startIcon={<TodayIcon color="primary" />}
            disableRipple={true}
          >
            <Typography fontWeight=" 700" variant="body1" color="primary">
              {`Due ${formatDate(
                data?.availableDates?.from,
                "DD/MM"
              )}-${formatDate(data?.availableDates?.to, "DD/MM")}`}
            </Typography>
          </MyButton>
          <MyButton
            disableRipple={true}
            className="btn list-btn"
            sx={{
              // height: "48px",
              boxShadow: "none",
              margin: "5px",
            }}
          >{`${data?.spots?.booked}/${data?.spots?.availableSpots} booked`}</MyButton>

          <div
            className=""
            style={{ display: "flex", gap: 5, justifyContent: "space-evenly" }}
          >
            {!isAdmin && (
              <>
                <IconButton
                  sx={{ height: "32px" }}
                  color="primary"
                  me={1}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handlerEditOffer(data);
                  }}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  sx={{ height: "32px" }}
                  color="primary"
                  me={1}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handlerDuplicateOffer(data);
                  }}
                >
                  <ContentCopyOutlinedIcon />
                </IconButton>
              </>
            )}
          </div>
        </Box>
      </Card>
    </>
  );
};

export default CompanyOffersList;
