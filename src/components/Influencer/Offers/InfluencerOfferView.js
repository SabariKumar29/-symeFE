import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Divider,
  Stack,
  Paper,
  Switch,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import CheckIcon from "@mui/icons-material/Check";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MyButton from "../../MyButton";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import OfferDetails from "../../OfferDetails/OfferDetails";
import InfluencerOffersList from "./InfluencerOffersList";
import SpeedIcon from "@mui/icons-material/Speed";
import { useSelector } from "react-redux";
import { offerStatusCode, reportOfferReason } from "../../../utils/constants";
import { formatDate } from "../../../utils/common";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import toaster from "../../Toaster/toaster";
import {
  useGetOfferByIdMutation,
  useGetOffersMutation,
  useReportOfferMutation,
} from "../../../services/apiService/userApiService";
import useLoading from "../../../hooks/useLoading";
import { useNavigate, useParams } from "react-router-dom";
import { notificationCode } from "../../../utils/constants";
import { useUpdateBookingStatusMutation } from "../../../services/apiService/userApiService";
import useNotification from "../../../hooks/usePushNotification";
import PhotoView from "./PhotoView";

const InfluencerOfferView = () => {
  const { offerId } = useParams(); // To get the offer id from URL
  const navigate = useNavigate(); // To navigate
  const { userType, userDtls, instagramData } = useSelector(
    (state) => state?.auth
  ); //To get user details from store
  const array = [1, 2, 3, 4, 5, 6]; // for testing
  const [reportOffer] = useReportOfferMutation(); // API to report the offer
  const [getOffers] = useGetOffersMutation();
  const [getOfferById] = useGetOfferByIdMutation(); // API to fetch the offer by user and offer id
  const [updateBookingStatus] = useUpdateBookingStatusMutation(); // API to update the booking status
  const { sendNotification } = useNotification(); //To sent notification
  const { startLoading, stopLoading } = useLoading(); // To loader
  const [offerDtls, setOfferDtls] = useState({}); // Offer details
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Report modal to open/close
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // cancel modal to open/close
  const [fromCompanyList, setFromCompanyList] = useState([]);
  const [similarOfferList, setSimilarOfferList] = useState([]);
  const [reportDtls, setReportDtls] = useState({
    reason: [],
    explanation: "",
    status: "Pending",
  }); // To get the report details

  /**
   * To handler fetch offers list
   */
  const handlerFetchOffers = async (setList, businessId, userId) => {
    try {
      startLoading();
      let filter = {};
      // if (noFilter) {
      filter.status = "active";
      // } else {
      //   filter = { ...filterDtls };
      //   if (dateList?.fromDate?.start || dateList?.fromDate?.start) {
      //     filter.fromDate = dateList?.fromDate;
      //   }
      //   if (dateList?.toDate?.start || dateList?.toDate?.start) {
      //     filter.toDate = dateList?.toDate;
      //   }
      //   filter.isCompany = userDtls.type === "company" ? true : false;
      //   filter.categories = filterDtls?.categories?.map((ele) => ele?.value);
      //   if (location?.locationName?.length > 0) {
      //     filter.location = filterLocation;
      //   }
      //   if (isCompany) {
      //     filter.influencerId = filterDtls?.name?.userId;
      //   } else {
      // filter.businessId = filterDtls?.name?.userId;
      //   }
      //   filter = Object.fromEntries(
      //     Object.entries(filter).filter(
      //       ([key, value]) =>
      //         value !== null &&
      //         value !== undefined &&
      //         value !== "" &&
      //         !(Array.isArray(value) && value.length === 0)
      //     )
      //   );
      // }
      // if (query?.length > 0) filter.search = query;
      if (businessId) {
        filter.businessId = businessId;
      }
      if (userId) {
        filter.influencerId = userId;
      }
      // if (userDtls?.type === "influencer") {
      //   filter.influencerId = userDtls?.userId;
      // }
      filter.followerCount = instagramData?.followers_count1 || 0;
      const response = await getOffers({
        id: userDtls?.userId,
        filter,
      }).unwrap();
      if (response?.data) {
        if (businessId) {
          offersListFormatter(
            response?.data?.filter((ele) => ele?._id !== offerId),
            setList
          );
        } else {
          const arr = response?.data?.filter((ele) => ele?._id !== offerId);
          if (arr.length > 3) {
            offersListFormatter(arr.slice(0, 3), setList);
          }
        }
      } else {
        setList([]);
      }
    } catch (err) {
      setList([]);
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
  const offersListFormatter = (data, setList, isObject) => {
    const formattedData = data?.map((item) => {
      let ele = { ...item };
      if (ele?.isRequestToBusiness) {
        ele.offerStatus = "pending";
      } else if (ele?.isOfferedToInfluencer) {
        ele.offerStatus = "check";
      } else if (ele?.isCompletedByInfluencer) {
        ele.offerStatus = "complete";
      } else {
        ele.offerStatus = "accept";
      }
      return ele;
    });
    console.log("setList", formattedData);
    if (isObject) {
      setList(formattedData[0]);
    } else {
      setList(formattedData);
    }
  };
  /**
   * To update booking status
   */
  const handlerUpdateBookingStatus = async (e, data, links) => {
    try {
      startLoading();
      e.stopPropagation();
      e.preventDefault();
      let payload = {
        offerId: data?._id,
        influencerId: userDtls?.userId,
      };
      const notificationPayload = { isRead: false, type: "remainder" };
      if (data?.offerStatus === "accept") {
        payload.newStatus = "requestToBusiness";
        notificationPayload.message = notificationCode?.offerRequested;
        notificationPayload.senderId = userDtls?.userId;
        notificationPayload.recipientId =
          data?.createdBy[0]?.userId || data?._id;
      } else if (data?.offerStatus === "approved") {
        payload.newStatus = "offeredToInfluencer";
        notificationPayload.message = notificationCode?.offerAccepted;
        notificationPayload.senderId = userDtls?.userId;
        notificationPayload.recipientId =
          data?.createdBy[0]?.userId || data?._id;
      } else {
        payload.newStatus = "completedByInfluencer";
        notificationPayload.message = notificationCode?.offerCompleted;
        notificationPayload.senderId = userDtls?.userId;
        notificationPayload.recipientId =
          data.createdBy[0].userId || data.createdBy;
        payload.links = links;
      }
      const response = await updateBookingStatus(payload).unwrap();
      if (response?.data) {
        fetchOfferById(offerId);
        sendNotification(notificationPayload);
      } else {
        toaster("error", response?.data?.message);
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
   * To fetch offer by id
   */
  const fetchOfferById = async (id) => {
    try {
      startLoading();
      const response = await getOfferById({
        offerId: id,
        influencerId: userDtls?.userId,
      }).unwrap();
      if (response?.data) {
        handlerFetchOffers(
          setFromCompanyList,
          response.data[0].createdBy[0].userId
        ); // from company
        handlerFetchOffers(setSimilarOfferList, null, userDtls?.userId); //Similar view
        offersListFormatter(response.data, setOfferDtls, true);
        // setOfferDtls(response.data[0]);
      }
    } catch (err) {
      // setOfferDtls([]);
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
   * To handle report offer
   */
  useEffect(() => {
    if (offerId) {
      fetchOfferById(offerId);
    }
  }, [offerId]);

  /**
   * To handle the report or cancel
   * @param {string} type
   */
  const handlerReportAndCancelOffer = async (type) => {
    try {
      startLoading();
      const response = await reportOffer({
        reason: reportDtls?.reason,
        explanation: reportDtls?.explanation,
        influencer_id: userDtls?.userId,
        isReport: type === "report",
        offer_id: offerDtls?._id,
      }).unwrap();
      if (response?.data) {
        console.log("offer List:", response?.data);
      } else {
        // setOffersList([]);
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to report offer:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };

  /**
   * To handle input change
   */
  const handleChange = (e, key) => {
    setReportDtls({ ...reportDtls, [key]: e?.target?.value });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle modal open/close
  const handleReportClick = () => {
    setIsReportModalOpen(true);
    handleClose();
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
    handleClose();
  };

  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
    handleClose();
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 500,
      },
    },
  };

  const Header = () => {
    return (
      <Box
        className="c-offer-header"
        display="flex"
        alignItems={"center"}
        height={"56px"}
        sx={{ padding: 1, margin: 1 }}
      >
        <MyButton
          type="backButton"
          onClick={() => {
            navigate(-1);
          }}
        />
        <Typography
          className="CardTitle"
          fontWeight="800"
          variant="h5"
          sx={{ marginRight: 1 }}
        >
          {offerDtls?.title}
        </Typography>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <MyButton
            className="btn dueDate"
            variant="outlined"
            sx={{ boxShadow: 0 }}
            color="gray"
          >
            <Typography fontWeight=" 700" variant="body1" color="primary">
              {offerDtls?.createdBy[0].username || "Company"}
            </Typography>
          </MyButton>
          {userType === "influencer" && (
            <>
              <MyButton color="blueLight">{`${offerDtls?.spots?.booked}/${offerDtls?.spots?.availableSpots} booked`}</MyButton>
              <MyButton
                color="light1"
                startIcon={<SentimentVerySatisfiedIcon color="primary" />}
              >
                <Typography fontWeight=" 700" variant="body1" color="primary">
                  {offerDtls?.categories[0]?.value}
                </Typography>
              </MyButton>
              <MyButton
                color="light1"
                startIcon={<TodayIcon color="primary" />}
              >
                <Typography fontWeight=" 700" variant="body1" color="primary">
                  {`Due ${formatDate(
                    offerDtls?.availableDates?.from,
                    "DD/MM"
                  )}-${formatDate(offerDtls?.availableDates?.to, "DD/MM")}`}
                </Typography>
              </MyButton>
              {!offerDtls?.isOfferedToInfluencer && (
                <MyButton
                  onClick={(e) => handlerUpdateBookingStatus(e, offerDtls)}
                  className="checkIcon btn"
                  color={offerStatusCode[offerDtls?.offerStatus]?.bg}
                  sx={{ borderRadius: 4, fontWeight: 700, height: "32px" }}
                  startIcon={<CheckIcon />}
                  disabled={
                    offerDtls?.isRequestToBusiness ||
                    offerDtls?.isCompletedByInfluencer
                  }
                >
                  <span className="checkIcon-text">
                    {`${
                      offerDtls?.isCompletedByInfluencer
                        ? "Completed"
                        : offerDtls?.isOfferedToInfluencer
                        ? "Check"
                        : offerDtls?.isRequestToBusiness
                        ? "Pending"
                        : " Active"
                    } ${
                      offerDtls?.offerStatus === "check"
                        ? formatDate(offerDtls?.availableDates?.to, "DD/MM") ||
                          ""
                        : ""
                    }`}
                  </span>
                </MyButton>
              )}
            </>
          )}
          <Button onClick={handleClick} sx={{ height: "32px" }} color="gray">
            <MoreVertIcon onClick={handleClick} />
          </Button>
          <Popover
            id={id}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              horizontal: "right",
              width: "200px",
            }}
            sx={{ top: "30px" }}
          >
            <Typography
              sx={{ p: 1, width: "150px", cursor: "pointer" }}
              onClick={handleReportClick}
            >
              Report
            </Typography>
            <Typography
              sx={{ p: 1, cursor: "pointer" }}
              onClick={handleCancelClick}
            >
              Cancel
            </Typography>
          </Popover>
        </Box>
      </Box>
    );
  };
  return (
    <div className="company-offer-ctn">
      {offerDtls?._id && <Header />}

      <Box className="card-view-NoHeader">
        <OfferDetails
          offerId={offerDtls?._id}
          isInfluencerView={true}
          handlerUpdateBookingStatus={handlerUpdateBookingStatus}
        />
        {fromCompanyList?.length > 0 && (
          <>
            {" "}
            <Box
              margin={1}
              padding={1}
              height={80}
              sx={{ boxShadow: 3 }}
              display={"flex"}
              alignItems={"center"}
            >
              <Typography variant="h5" color="gray">
                More from company
              </Typography>
            </Box>
            <Box className="similarCtn">
              {fromCompanyList?.map((ele, index) => {
                return (
                  <PhotoView
                    style={{ overFlow: "auto" }}
                    data={ele}
                    key={index}
                    isSimilarView={true}
                  ></PhotoView>
                );
              })}
            </Box>
          </>
        )}

        {similarOfferList?.length > 0 && (
          <>
            <Box
              margin={1}
              padding={1}
              height={80}
              sx={{ boxShadow: 3 }}
              display={"flex"}
              alignItems={"center"}
            >
              <Typography variant="h5" color="gray">
                Similar offers
              </Typography>
            </Box>
            <Box className="similarCtn">
              {similarOfferList.map((ele, index) => {
                return (
                  <PhotoView
                    isSimilarView={true}
                    style={{ overFlow: "auto" }}
                    data={ele}
                    key={index}
                  ></PhotoView>
                );
              })}
            </Box>
          </>
        )}
      </Box>
      {/* Report Modal */}
      <Modal open={isReportModalOpen} onClose={handleReportModalClose}>
        <Box
          className="filter-modal"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "1px solid #e8def8",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <ArrowBackIcon onClick={handleReportModalClose} />
            <Typography variant="h6" component="h2">
              Report Issue
            </Typography>
            <CloseIcon
              onClick={handleReportModalClose}
              sx={{ marginLeft: "auto" }}
            />
          </Box>
          <Divider />
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <Stack sx={{ gap: "10px" }}>
              <Typography component="h2">Reason for reporting</Typography>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Reason
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={reportDtls?.reason}
                  onChange={(e) => handleChange(e, "reason")}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {reportOfferReason?.map((ele) => (
                    <MenuItem key={ele?.id} value={ele?.value}>
                      <Checkbox
                        checked={reportDtls?.reason.indexOf(ele?.value) > -1}
                      />
                      <ListItemText primary={ele?.value} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography component="h2">Explain</Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                defaultValue={reportDtls?.explanation}
                onChange={(e) => handleChange(e, "explanation")}
              />
              <Stack
                sx={{
                  background: "#ffd43a",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  component="h2"
                  sx={{ padding: "10px", display: "flex", gap: "10px" }}
                >
                  <SpeedIcon />
                  Reporting this offer means you will no longer be able to
                  interact with it.
                </Typography>
              </Stack>
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Switch defaultChecked />
                <Typography variant="body2">I Understand</Typography>
              </Paper>
            </Stack>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            mt={3}
            justifyContent="space-between"
          >
            <MyButton
              sx={{
                width: "50%",
                borderRadius: "15px",
                borderColor: "text.secondary",
              }}
            >
              Help
            </MyButton>
            <MyButton
              sx={{
                width: "50%",
                borderRadius: "15px",
                borderColor: "text.secondary",
              }}
              disabled={
                !reportDtls?.reason?.length > 0 || !reportDtls?.explanation
              }
              onClick={() => handlerReportAndCancelOffer("report")}
            >
              Report offer
            </MyButton>
          </Stack>
        </Box>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={isCancelModalOpen} onClose={handleCancelModalClose}>
        <Box
          className="filter-modal"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "1px solid #e8def8",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <ArrowBackIcon onClick={handleCancelModalClose} />
            <Typography variant="h6" component="h2">
              Cancel Offer
            </Typography>
            <CloseIcon
              onClick={handleCancelModalClose}
              sx={{ marginLeft: "auto" }}
            />
          </Box>
          <Divider />
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <Stack sx={{ gap: "10px" }}>
              <Typography component="h2">Reason for cancelling</Typography>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Reason
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={reportDtls?.reason}
                  onChange={(e) => handleChange(e, "reason")}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {reportOfferReason?.map((ele) => (
                    <MenuItem key={ele?.id} value={ele?.value}>
                      <Checkbox
                        checked={reportDtls?.reason.indexOf(ele?.value) > -1}
                      />
                      <ListItemText primary={ele?.value} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography component="h2">Explain</Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
              <Stack
                sx={{
                  background: "#ffd43a",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  component="h2"
                  sx={{ padding: "10px", display: "flex", gap: "10px" }}
                >
                  <SpeedIcon />
                  Cancelling this offer means you will no longer be able to
                  interact with it.
                </Typography>
              </Stack>
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Switch defaultChecked />
                <Typography variant="body2">I Understand</Typography>
              </Paper>
            </Stack>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            mt={3}
            justifyContent="space-between"
          >
            <MyButton
              sx={{
                width: "50%",
                borderRadius: "15px",
                borderColor: "text.secondary",
              }}
              disabled={
                !reportDtls?.reason?.length > 0 || !reportDtls?.explanation
              }
            >
              Help
            </MyButton>
            <MyButton
              sx={{
                width: "50%",
                borderRadius: "15px",
                borderColor: "text.secondary",
              }}
              onClick={() => handlerReportAndCancelOffer("cancel")}
            >
              Cancel offer
            </MyButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};
export default InfluencerOfferView;
