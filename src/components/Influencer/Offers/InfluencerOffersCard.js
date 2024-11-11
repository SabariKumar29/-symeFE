import React, { useCallback, useEffect, useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import MyButton from "../../MyButton";
import PhotoCardView from "../../PhotoCardView/PhotoCardView";
import Popover from "@mui/material/Popover";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./InfluencerOffers.css";
import CloseIcon from "@mui/icons-material/Close";
import OfferDetails from "../../OfferDetails/OfferDetails";
import InfluencerOffersList from "./InfluencerOffersList";
import SpeedIcon from "@mui/icons-material/Speed";
import { useSelector } from "react-redux";
import {
  cancelOfferReason,
  offerStatusCode,
  reportOfferReason,
} from "../../../utils/constants";
import { formatDate } from "../../../utils/common";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import toaster from "../../Toaster/toaster";
import {
  useGetOfferByIdMutation,
  useReportOfferMutation,
} from "../../../services/ApiService";
import useLoading from "../../../hooks/useLoading";
import PhotoView from "./PhotoView";

const InfluencerOffersCard = (props) => {
  const { data, setIsCardSelected, handlerUpdateBookingStatus } = props;
  const { userType, userDtls } = useSelector((state) => state?.auth);
  console.log(userType);
  const array = [1, 2, 3, 4, 5, 6];
  const [reportOffer] = useReportOfferMutation();
  const [getOfferById] = useGetOfferByIdMutation();
  const { startLoading, stopLoading } = useLoading();
  const [offerDtls, setOfferDtls] = useState({});
  const [cardSelected, setCardSelected] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reportDtls, setReportDtls] = useState({
    reason: [],
    explanation: "",
    status: "Pending",
  });
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
        setOfferDtls(response.data[0]);
        // data = response.data;
      } else {
        setIsCardSelected(false);
        setOfferDtls([]);
      }
    } catch (err) {
      setIsCardSelected(false);
      setOfferDtls([]);
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
    fetchOfferById(data?._id);
  }, []);
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
        // setOffersList(response?.data);
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
        {cardSelected && (
          <MyButton
            type="backButton"
            onClick={() => {
              setCardSelected(false);
              setIsCardSelected(false);
            }}
          />
        )}
        <Typography className="CardTitle" fontWeight="800" variant="h5">
          {cardSelected ? offerDtls?.title : "Offers"}
        </Typography>
        {cardSelected ? (
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <MyButton
              className="btn dueDate"
              variant="outlined"
              // height="32px"
              sx={{ boxShadow: 0 }}
              color="gray"
              // startIcon={<TodayIcon color="primary" />}
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
                {/* </Box> */}
                {!data?.isOfferedToInfluencer && (
                  <MyButton
                    onClick={(e) => handlerUpdateBookingStatus(e, data)}
                    className="checkIcon btn"
                    color={offerStatusCode[data?.offerStatus]?.bg}
                    sx={{ borderRadius: 4, fontWeight: 700, height: "32px" }}
                    startIcon={<CheckIcon />}
                    disabled={
                      data?.isRequestToBusiness || data?.isCompletedByInfluencer
                    }
                  >
                    <span className="checkIcon-text">
                      {`${offerStatusCode[data?.offerStatus]?.name} ${
                        data?.offerStatus === "check"
                          ? formatDate(data?.availableDates?.to, "DD/MM") || ""
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
        ) : (
          <MyButton
            className="addIcon btn"
            color="secondary"
            sx={{
              borderRadius: 4,
              fontWeight: 700,
              border: 1,
              borderColor: "secondary",
            }}
            startIcon={<AddIcon sx={{ margin: "0px" }} />}
          >
            <span className="checkIcon-text">Create offers</span>
          </MyButton>
        )}
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
        {/* <Typography> */}
        <Box
          // margin={1}
          // padding={1}
          // height={396}
          // width={1000}
          sx={{
            boxShadow: 3,
            // overflow: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            objectFit: "cover",
          }}
          display={"-webkit-box"}
          // alignItems={"center"}
        >
          {/* {array.map((ele, index) => { */}
          {/* return <PhotoCardView width="330px" height="380px" />; */}
          {/* return (
              <PhotoView
                style={{ overFlow: "auto" }}
                data={ele}
                // handleSelectOffersCard={handleSelectOffersCard}
                handlerUpdateBookingStatus={handlerUpdateBookingStatus}
                key={index}
              ></PhotoView>
            );
          })} */}
        </Box>
        {/* </Typography> */}

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
        {/* <Typography> */}
        <Box>
          {array.map((ele, index) => {
            return (
              <InfluencerOffersList
                style={{ overFlow: "auto" }}
                module={"offer"}
              ></InfluencerOffersList>
            );
          })}
        </Box>
        {/* </Typography> */}
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
              {/* <Autocomplete
                disablePortal
                sx={{ width: 350 }}
                options={["TEST", "TEST", "demo"]}
                renderInput={(params) => (
                  <TextField {...params} placeholder="select" />
                )}
              /> */}
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
              {/* <Autocomplete
                disablePortal
                sx={{ width: 350 }}
                options={cancelOfferReason}
                renderInput={(params) => (
                  <TextField {...params} placeholder="select" />
                )}
              /> */}
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
export default InfluencerOffersCard;
