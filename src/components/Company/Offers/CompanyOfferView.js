import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import MyButton from "../../MyButton";
import DoneIcon from "@mui/icons-material/Done";
import Badge from "@mui/material/Badge";
import "./CompanyOffers.css";
import TodayIcon from "@mui/icons-material/Today";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ListIcon from "@mui/icons-material/List";
import influencerCardIcon from "../../../assets/image/InfluencerCardIcon.png";
import { Stack } from "@mui/material";
import CompanyOffersRequest from "./CompanyOffersRequest";
import OfferDetails from "../../OfferDetails/OfferDetails";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  useUpdateBookingStatusMutation,
  useGetOfferByIdMutation,
} from "../../../services/apiService/userApiService";
import toaster from "../../Toaster/toaster";
import { useSelector } from "react-redux";
import { notificationCode, offerFilterCode } from "../../../utils/constants";
import { formatDate } from "../../../utils/common";
import useNotification from "../../../hooks/usePushNotification";
import useLoading from "../../../hooks/useLoading";
import { useNavigate, useParams } from "react-router-dom";

//
const CompanyOfferView = () => {
  const { offerId } = useParams(); // To get the offer id from URL
  const navigate = useNavigate(); // To navigate
  const { userDtls } = useSelector((state) => state?.auth); // To get the user data from the store
  const { startLoading, stopLoading } = useLoading(); //To set loading
  const [getOfferById] = useGetOfferByIdMutation(); // To fetch offer by id
  const { sendNotification } = useNotification(); // To send a notification
  const [offersCardTab, setOffersCardTab] = useState("status");
  const [tabCardFilter, setTabCardFilter] = useState("pending");
  const [offerDtls, SetOfferDtls] = useState({});
  const [selectedInfluencer, SetSelectedInfluencer] = useState({});

  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  /**
   * To handle report offer
   */
  useEffect(() => {
    if (offerId) {
      fetchOfferById(offerId);
    }
  }, [offerId]);

  /**
   * To handle the offers card tab
   * @param (tabName)
   * @returns null
   */
  const handleOffersCardTab = (event, tabName) => {
    setOffersCardTab(tabName);
  };

  /**
   * To handle the tab card filter
   * @param (tabName)
   * @returns null
   */
  const handlerTabCardFilter = (filterCode) => {
    setTabCardFilter(filterCode);
  };

  /**
   * Header view
   * @returns Jsx element
   */
  const Header = () => {
    return (
      <Box
        className="c-offer-header"
        display="flex"
        alignItems={"center"}
        height={"56px"}
        sx={{ padding: 5, margin: "5 10 5 10" }}
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
          variant="h4"
          color="gray"
        >
          {offerDtls?.title}
        </Typography>
        <>
          <MyButton
            className="btn duteDate"
            variant="outlined"
            sx={{ height: "32px", boxShadow: 0 }}
            color="gray"
            startIcon={<TodayIcon color="primary" />}
          >
            <Typography fontWeight="700" variant="body1" color="primary">
              {`Due ${formatDate(
                offerDtls?.availableDates?.from,
                "DD/MM"
              )}-${formatDate(offerDtls?.availableDates?.to, "DD/MM")}`}
            </Typography>
          </MyButton>
          <IconButton
            sx={{ height: "32px" }}
            color="gray"
            className="moreVertIcon btn"
          >
            <MoreVertIcon />
          </IconButton>
        </>
      </Box>
    );
  };

  /**
   * To company handle the approve influencer request
   */
  const handlerApproveOrIgnoreRequest = async (userId, isApproved) => {
    try {
      startLoading();
      const payload = {
        offerId: offerDtls?._id,
        newStatus: isApproved ? "offeredToInfluencer" : "rejectedOffers",
        influencerId: userId,
      };
      const response = await updateBookingStatus(payload).unwrap();
      if (response?.data) {
        fetchOfferById(offerDtls?._id);
        sendNotification({
          senderId: userDtls?.userId,
          recipientId: userId,
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
   * To fetch offer by id
   */
  const fetchOfferById = async (id) => {
    try {
      startLoading();
      const response = await getOfferById({ offerId: id }).unwrap();
      if (response?.data) {
        SetOfferDtls(response.data[0]);
      } else {
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
  return (
    <div className="company-offer-ctn">
      <Header />
      <TabContext value={offersCardTab} sx={{ padding: "5px", width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleOffersCardTab}
            aria-label="lab API tabs example"
            sx={{ textTransform: "capitalize" }}
          >
            <Tab
              sx={{ textTransform: "capitalize" }}
              icon={<QueryStatsIcon />}
              fontWeight={700}
              label="Status"
              value="status"
              color="white"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              icon={<LocalOfferOutlinedIcon />}
              label="Content"
              value="content"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              icon={<ListIcon />}
              label="Request"
              value="request"
            />
          </TabList>
        </Box>
        <TabPanel padding="5" sx={{ width: "100%" }} value="status">
          <Box
            className="tab-view"
            margin={"5px"}
            display={"flex"}
            sx={{ gap: "5px" }}
          >
            <MyButton
              onClick={() => handlerTabCardFilter("pending")}
              className="checkIcon btn"
              color={`${tabCardFilter === "pending" ? "secondary" : "white"}`}
              sx={{
                borderRadius: 1,
                height: "32px",
                boxShadow: "none",
              }}
              startIcon={<DoneIcon />}
            >
              Requested
              <Badge sx={{ marginLeft: 2 }}>
                <span className="badge">
                  {offerDtls?.requestToBusiness?.length || ""}
                </span>
              </Badge>
            </MyButton>
            <MyButton
              onClick={() => handlerTabCardFilter("approved")}
              className="checkIcon btn"
              color={`${tabCardFilter === "approved" ? "secondary" : "white"}`}
              sx={{
                borderRadius: 1,
                height: "32px",
                boxShadow: "none",
              }}
            >
              Booked
              <Badge sx={{ marginLeft: 2 }}>
                <span className="badge">{`${offerDtls?.spots?.booked}/${offerDtls?.spots?.availableSpots}`}</span>
              </Badge>
            </MyButton>
            <MyButton
              onClick={() => handlerTabCardFilter("rejected")}
              className="checkIcon btn"
              color={`${tabCardFilter === "rejected" ? "secondary" : "white"}`}
              sx={{
                borderRadius: 1,
                height: "32px",
                boxShadow: "none",
              }}
            >
              Rejected
            </MyButton>
            <MyButton
              onClick={() => handlerTabCardFilter("completed")}
              className="checkIcon btn"
              color={`${tabCardFilter === "completed" ? "secondary" : "white"}`}
              sx={{
                borderRadius: 1,
                height: "32px",
                boxShadow: "none",
              }}
            >
              Completed
            </MyButton>
          </Box>

          <div className="card-status">
            {offerDtls[offerFilterCode[tabCardFilter]]?.map((ele, index) => {
              return (
                <Box
                  onClick={() => {
                    if (selectedInfluencer?.userId !== ele?.userId) {
                      SetSelectedInfluencer(ele || {});
                    } else {
                      SetSelectedInfluencer({});
                    }
                  }}
                  className={
                    "btn action-btn CompleteCard " +
                    (selectedInfluencer?.userId === ele?.userId &&
                      "card-active-btn")
                  }
                  // color={
                  //   selectedInfluencer?.userId === ele?.userId ? "primary" : "light2"
                  // }
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    // color: "secondary",
                    padding: "8px",
                    border: "1px",
                    borderRadius: "7px",
                    margin: "5px",
                  }}
                >
                  <Stack
                    direction={"row"}
                    marginBottom={2}
                    sx={{
                      gap: "7px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    gap={2}
                  >
                    <img
                      className="imageIcon"
                      src={ele?.profileImage || influencerCardIcon}
                      alt="loading"
                    ></img>
                    <Stack direction={"row"} gap={2} alignItems={"center"} i>
                      <Typography variant="body1" fontWeight=" 700">
                        {ele?.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight=" 500"
                        color={"gray.main"}
                      >
                        {ele?.email}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    gap={2}
                    direction={"row"}
                    marginBottom={2}
                    justifyContent={"center"}
                  >
                    {tabCardFilter === "pending" && (
                      <MyButton
                        onClick={() =>
                          handlerApproveOrIgnoreRequest(ele?.userId)
                        }
                        sx={{
                          height: "48px",
                          boxShadow: 0,
                          borderRadius: 7,
                          width: "100%",
                        }}
                        color="white"
                        startIcon={<VisibilityOffIcon color="primary" />}
                      >
                        {offerDtls?.rejectedOffers?.find(
                          (item) => item?.userId === ele?.userId
                        )
                          ? "Request ignored"
                          : "Ignore"}
                      </MyButton>
                    )}
                    {tabCardFilter !== "completed" && (
                      <MyButton
                        disabled={tabCardFilter === "approved"}
                        onClick={() =>
                          handlerApproveOrIgnoreRequest(ele?.userId, true)
                        }
                        className="checkIcon btn"
                        variant="outlined"
                        color="black"
                        sx={{
                          borderRadius: 7,
                          border: "none",
                          fontWeight: 700,
                          height: "40px",
                          boxShadow: "none",
                          width: "100%",
                          bgcolor:
                            tabCardFilter === "approved"
                              ? "green.main"
                              : "light.main",
                        }}
                        startIcon={<CheckIcon />}
                      >
                        {tabCardFilter === "approved"
                          ? `Check-in :${formatDate(
                              offerDtls?.availableDates?.to,
                              "DD/MM"
                            )}`
                          : "Approve request"}
                      </MyButton>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </div>
          {offerDtls[offerFilterCode[tabCardFilter]]?.length === 0 && (
            <Box
              mt={10}
              width={"100%"}
              height={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography fontWeight="700" variant="body1" color="primary">
                No data found.
              </Typography>
            </Box>
          )}
        </TabPanel>
        <TabPanel
          className="c-offers-content"
          sx={{ width: "100%" }}
          value="content"
        >
          <OfferDetails offerId={offerDtls?._id} />
        </TabPanel>
        <TabPanel
          sx={{
            width: "100%",
            height: "calc(100vh - 132px)",
            overflow: "hidden auto",
          }}
          value="request"
        >
          <CompanyOffersRequest
            data={{ ...offerDtls }}
            selectedInfluencer={{ ...selectedInfluencer }}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
};
export default CompanyOfferView;
