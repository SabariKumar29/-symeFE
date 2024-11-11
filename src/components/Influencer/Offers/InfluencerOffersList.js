import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import TodayIcon from "@mui/icons-material/Today";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MyButton from "../../MyButton";
import ChatIcon from "@mui/icons-material/Chat";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import "./InfluencerOffers.css";
import { useSelector } from "react-redux";
import { notificationCode, offerStatusCode } from "../../../utils/constants";
import { formatDate } from "../../../utils/common";
import { IconButton } from "@mui/material";
import toaster from "../../Toaster/toaster";
import {
  useCreateChatMutation,
  useSaveOfferMutation,
  useUpdateBookingStatusMutation,
} from "../../../services/apiService/userApiService";
import useLoading from "../../../hooks/useLoading";
import useNotification from "../../../hooks/usePushNotification";
import { useNavigate } from "react-router-dom";

const InfluencerOffersList = ({
  data,
  module,
  showApproveReject,
  handlerUpdateBookingStatus,
  handlerFetchOffers,
  isSavedOffer,
}) => {
  const navigate = useNavigate();
  const { userDtls } = useSelector((state) => state?.auth);
  const { startLoading, stopLoading } = useLoading();
  const [saveOffer] = useSaveOfferMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [createChat] = useCreateChatMutation();
  const { sendNotification } = useNotification();
  console.log(
    `${offerStatusCode[data?.offerStatus]?.name} ${
      data?.offerStatus === "check"
        ? formatDate(data?.availableDates?.to) || ""
        : ""
    }`
  );
  const { userType } = useSelector((state) => state?.auth);

  /**
   * To handle the save offer function
   * @param {event}
   */
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
        handlerFetchOffers(true);
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
  /**
   * To company handle the approve influencer request
   */
  const handlerApproveOrIgnoreRequest = async (offerId, isApproved) => {
    try {
      startLoading();
      const payload = {
        offerId,
        newStatus: isApproved ? "offeredToInfluencer" : "rejectedOffers",
        influencerId: userDtls?.userId,
      };
      const response = await updateBookingStatus(payload).unwrap();
      if (response?.data) {
        handlerFetchOffers(true);
        sendNotification({
          senderId: userDtls?.userId,
          recipientId: data?.influencerDetails?.userId,
          message: isApproved
            ? notificationCode?.offerAccepted
            : notificationCode?.offerIgnored,
          isRead: false,
          type: "remainder",
        });
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Sign up:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To handle the chat navigation
   */
  const handlerChat = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      startLoading();
      const payload = {
        isGroupChat: false,
        id: userDtls?.userId,
      };
      if (userDtls?.type === "influencer") {
        payload.userId = data?.createdBy;
      } else {
        payload.userId = data?.influencerDetails?.userId;
      }
      const response = await createChat(payload).unwrap();
      if (response?.data[0]?._id || response?.data?._id) {
        navigate(`/chat/${response?.data[0]?._id || response?.data?._id}`);
        // navigate("/message");
      } else {
        toaster("error", "Chat creation failed");
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Sign up:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * create chat
   */
  const handlerCreateChat = () => {};
  return (
    <>
      <Card
        className="card-ctn"
        sx={{
          padding: "6px",
          height: 92,
          boxShadow:
            "0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
          width: "100%",
          borderRadius: "2px",
          margin: "5px",
          overflow: "unset",
          cursor: "pointer",
        }}
      >
        <Box
          onClick={() => navigate(`/offers/${data?._id}`)}
          className="list-view-ctn"
          variant="contained"
          component="section"
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            borderRadius: "2px",
            width: "100%",
            bgcolor: "white.main",
          }}
        >
          <CardMedia
            // onClick={
            // module === "offer" ? () => handleSelectOffersCard(data) : null
            // }
            className="CardMedia"
            component="img"
            alt="green iguana"
            height={"80px"}
            width={"80px"}
            image={data?.offerImages[0]}
            sx={{ width: "80px", borderRadius: "2px" }}
          />
          <Typography
            className="textEllipsis CardTitle"
            width={"230px"}
            color={"gray.main"}
            fontWeight=" 700"
            variant="body1"
          >
            {data?.title}
          </Typography>

          {/* <div style={{ display: "flex", gap: "10px" }}>
            <MyButton
              className="btn list-btn"
              sx={{ height: "32px", cursor: "default" }}
              variant="outlined"
            >
              {userType === "influencer"
                ? data?.createdBy[0]?.username ||
                  data?.companyDetails?.username ||
                  "Company "
                : data?.influencerDetails?.username || "Influencer"}
            </MyButton>
          </div> */}
          {/* <Box>
            {userType === "influencer"
              ? data?.createdBy[0]?.username ||
                data?.companyDetails?.username ||
                "Company "
              : data?.influencerDetails?.username || "Influencer"}
          </Box> */}
          <Typography
            className="textEllipsis CardTitle"
            width={"140px"}
            height={32}
            color={"gray.main"}
            fontWeight=" 700"
            variant="body1"
            marginLeft={"auto"}
            textAlign={"center"}
            bgcolor={"gray.secondary"}
          >
            {userType === "influencer"
              ? data?.createdBy[0]?.username ||
                data?.companyDetails?.username ||
                "Company "
              : data?.influencerDetails?.username || "Influencer"}
          </Typography>

          {/* <div
            className="span2"
            style={{
              gap: 5px,
              justifyContent: "center",
              alignItems: "center",
            }}
          > */}
          {module === "offer" && (
            <MyButton
              sx={{ height: "32px", boxShadow: 0 }}
              color="light1"
              startIcon={<SentimentVerySatisfiedIcon color="primary" />}
              className="btn list-btn"
            >
              <Typography fontWeight=" 700" variant="body1" color="primary">
                {data?.categories[0]?.value || "test"}
              </Typography>
            </MyButton>
          )}
          <MyButton
            className="btn list-btn"
            sx={{ height: "32px", boxShadow: 0 }}
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
          {module === "offer" && (
            <>
              <MyButton
                onClick={(e) => handlerUpdateBookingStatus(e, data)}
                className="checkIcon btn list-btn"
                color={offerStatusCode[data?.offerStatus]?.bg}
                sx={{ borderRadius: 4, fontWeight: 700, height: "32px" }}
                startIcon={<CheckIcon />}
                disabled={!(data?.offerStatus === "accept")}
              >
                {/* <span className="checkIcon-text"> */}
                {/* {`${offerStatusCode[data?.offerStatus]?.name} ${
                    data?.offerStatus === "check"
                      ? formatDate(data?.availableDates?.to) || ""
                      : ""
                  }`} */}
                {data?.offerStatus || "test"}
                {/* </span> */}
              </MyButton>
              {/*  {userDtls?.type === "influencer" && ( */}
              <IconButton
                sx={{ height: "32px" }}
                color="primary"
                onClick={(e) => handlerSaveOffer(e)}
              >
                {isSavedOffer ? <TurnedInIcon /> : <TurnedInNotIcon />}
              </IconButton>
              {/*  )} */}
            </>
          )}
          {userType === "company" && showApproveReject && (
            <>
              <MyButton
                onClick={(e) => handlerUpdateBookingStatus(e, data)}
                className="checkIcon btn"
                variant="outlined"
                sx={{
                  borderRadius: 7,
                  fontWeight: 700,
                  height: "40px",
                  boxShadow: "none",
                  // borderColor: "secondary",
                }}
                startIcon={<CheckIcon />}
              >
                Approve request
              </MyButton>
              <MyButton
                onClick={() => handlerApproveOrIgnoreRequest(data?._id)}
                sx={{
                  height: "48px",
                  boxShadow: 0,
                  borderRadius: 7,
                  bgcolor: "white.main",
                }}
                color="white"
                startIcon={<VisibilityOffIcon color="primary" />}
                className="btn"
              >
                Ignore
              </MyButton>{" "}
            </>
          )}
          {/* </div> */}
          {module !== "offer" && (
            <IconButton
              sx={{ height: "32px" }}
              color="primary"
              onClick={(e) => handlerChat(e)}
            >
              {<ChatIcon />}
            </IconButton>
          )}
        </Box>
      </Card>
    </>
  );
};

export default InfluencerOffersList;
