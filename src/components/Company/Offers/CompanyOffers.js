import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import MyButton from "../../MyButton";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import Badge from "@mui/material/Badge";
import "./CompanyOffers.css";
import CompanyOffersList from "./CompanyOffersList";
import TodayIcon from "@mui/icons-material/Today";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ListIcon from "@mui/icons-material/List";
import influencerCardIcon from "../../../assets/image/InfluencerCardIcon.png";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import defaultProfileImg from "../../../assets/image/defaultProfileImg.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Autocomplete,
  Chip,
  Divider,
  InputAdornment,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import CompanyOffersRequest from "./CompanyOffersRequest";
import CreateOffers from "./CreateOffers";
import OfferDetails from "../../OfferDetails/OfferDetails";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  useGetOffersMutation,
  useUpdateBookingStatusMutation,
  useGetOfferByIdMutation,
  useGetCompanyOrInfluencerListMutation,
} from "../../../services/apiService/userApiService";
import toaster from "../../Toaster/toaster";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  categoryList,
  filterDtlsInitialValue,
  notificationCode,
  offerFilterCode,
  offerStatusCode,
} from "../../../utils/constants";
import { formatDate } from "../../../utils/common";
import useNotification from "../../../hooks/usePushNotification";
import useLoading from "../../../hooks/useLoading";
import SearchBar from "../../Search";
import TuneIcon from "@mui/icons-material/Tune";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import LocationAutoComplete from "../../LocationAutoComplete/LocationAutoComplete";
import { FixedSizeList as List } from "react-window";

//
const CompanyOffer = () => {
  const navigate = useNavigate(); // To navigate
  const { userDtls, isCompany } = useSelector((state) => state?.auth);
  const locationInputRef = useRef();
  const { startLoading, stopLoading } = useLoading();
  const [getOffers] = useGetOffersMutation();
  const [getOfferById] = useGetOfferByIdMutation();
  const [getInfluencerOrCompanyList] = useGetCompanyOrInfluencerListMutation();
  const [offersListTab, setOffersListTab] = useState("active");
  const [offersCardTab, setOffersCardTab] = useState("status");
  const [query, setQuery] = useState("");
  // const [tabFilter, setTabFilter] = useState("all");
  const [tabCardFilter, setTabCardFilter] = useState("pending");
  const [offerType, setOfferType] = useState("Create");
  const [offersList, setOffersList] = useState([]);
  const [location, setLocation] = useState({});
  const [filterLocation, setFilterLocation] = useState({});
  const [nameList, setNameList] = useState([]);
  const [cardSelected, setCardSelected] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowCreateOffers, setIsShowCreateOffers] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [editOfferDtls, setEditOfferDtls] = useState({});
  const [itemSize, setItemSize] = useState(170);
  const [dateList, setDateList] = useState({
    fromDate: { start: "", end: "" },
    toDate: { start: "", end: "" },
  });
  const [filterDtls, setFilterDtls] = useState(filterDtlsInitialValue);
  const { sendNotification } = useNotification();

  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  /**
   * To handler fetch offers list
   */
  const handlerFetchOffers = async (noFilter, query, status) => {
    try {
      startLoading();
      let filter = {};
      if (noFilter) {
      } else {
        filter = { ...filterDtls };
        // filter.fromDate = dateList[0] ? new Date(dateList[0]) : "";
        // filter.toDate = dateList[1] ? new Date(dateList[1]) : "";
        // filter.date = dateList;
        if (dateList?.fromDate?.start || dateList?.fromDate?.start) {
          filter.fromDate = dateList?.fromDate;
        }
        if (dateList?.toDate?.start || dateList?.toDate?.start) {
          filter.toDate = dateList?.toDate;
        }
        filter.isCompany = userDtls.type === "company" ? true : false;
        filter.categories = filterDtls?.categories?.map((ele) =>
          ele?.value.replace("&", "-")
        );
        if (location?.locationName?.length > 0) {
          filter.location = filterLocation;
        }
        if (isCompany) {
          filter.influencerId = filterDtls?.name?.userId;
        } else {
          filter.businessId = filterDtls?.name?.userId;
        }
        filter = Object.fromEntries(
          Object.entries(filter).filter(
            ([key, value]) =>
              value !== null &&
              value !== undefined &&
              value !== "" &&
              !(Array.isArray(value) && value.length === 0)
          )
        );
      }
      if (query?.length > 0) filter.search = query;

      if (userDtls?.type === "influencer") {
        filter.influencerId = userDtls?.userId;
      }
      if (userDtls?.type !== "admin") {
        filter.businessId = userDtls?.userId;
        filter.isCompany = userDtls.type === "company";
      }

      filter.status = status || offersListTab || "active";

      const response = await getOffers({
        id: userDtls?.userId,
        filter,
      }).unwrap();
      if (response?.data) {
        console.log("offer List:", response?.data);
        setOffersList(response?.data);
      } else {
        setOffersList([]);
        toaster("info", response?.message);
      }
    } catch (err) {
      setOffersList([]);
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
   * To fetch company or influencer dtls
   */
  const fetchCompanyOrInfluencerDtls = async () => {
    try {
      startLoading();
      const resp = await getInfluencerOrCompanyList(
        isCompany ? "influencer" : "company"
      );
      if (resp?.data?.data?.length) {
        setNameList(resp?.data?.data || []);
      } else {
        setNameList([]);
      }
    } catch (err) {
      setNameList([]);
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to  fetch name list:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    handlerFetchOffers(true);
    fetchCompanyOrInfluencerDtls();
  }, [userDtls]);

  // Dynamically calculate item size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Adjust item size based on the screen width
      if (screenWidth < 768) {
        setItemSize(220); // Smaller item size for mobile screens
      } else if (screenWidth >= 768 && screenWidth < 1024) {
        setItemSize(230); // Medium size for tablets
      } else {
        setItemSize(120); // Larger size for desktops
      }
    };

    // Add resize event listener to handle screen resize
    window.addEventListener("resize", handleResize);

    // Set initial item size on mount
    handleResize();

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * To edit the offer
   */
  const handlerEditOffer = (dtls) => {
    // e?.defaultPrevented();
    // e?.stopPropagation();
    setOfferType("Edit");
    setIsShowCreateOffers(true);
    setEditOfferDtls({ ...dtls });
    // set;
  };
  /**
   * To duplicate the offer
   */
  const handlerDuplicateOffer = (dtls) => {
    setOfferType("Duplicate");
    setIsShowCreateOffers(true);
    setEditOfferDtls({ ...dtls });
  };
  /**
   * To handle set tab view
   * @param (tabName)
   * @returns null
   */
  const handleSetOffersTab = (event, tabName) => {
    setOffersListTab(tabName);
    setQuery("");
    handlerFetchOffers("", "", tabName);
  };

  /**
   * To handle the tab filter
   * @param (tabName)
   * @returns null
   */
  // const handleTabFilter = (filterCode) => {
  //   setTabFilter(filterCode);
  // };

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
   * To handle the offer card view
   * @param (data)
   * @returns null
   */
  const handleOffer = (data) => {
    navigate(`/offers/${data?._id}`);
  };

  /**
   * To handle close create offer modal
   */
  const handlerCloseCreateOfferModal = (bool) => {
    setIsShowCreateOffers(bool);
    if (bool) setEditOfferDtls({});
  };
  const handleOpen = () => {
    setIsShowFilter(true);
  };
  const handleClearFilters = () => {
    setFilterDtls({ ...filterDtlsInitialValue });
    setDateList({
      fromDate: { start: "", end: "" },
      toDate: { start: "", end: "" },
    });
    setLocation({});
    setFilterLocation({});
    // setSearchQuery("");
    // setSelectedTypes([]);
    // setSelectedOptions([]); // Clear location
    // setValue([null, null]); // Clear date range
    handlerFetchOffers(true);
  };

  /**
   * To handle date onchange
   */
  const handlerDateOnchange = (key1, key2, value) => {
    setDateList((prev) => {
      return { ...prev, [key1]: { ...prev[key1], [key2]: value } };
    });
  };

  /**
   * To handle changes in input field
   */
  const handlerOnchange = (key1, value) => {
    if (key1 === "location") {
      setFilterDtls({ ...filterDtls, location: value });
      return;
    }
    setFilterDtls({
      ...filterDtls,
      [key1]: Array.isArray(filterDtls[key1])
        ? checkDuplicate(filterDtls[key1], value)
        : value?.value || value || "",
    });
  };
  /**
   * for virtual scroll
   * */
  const VirtualizedCompanyOffersList = ({
    offersList,
    offersListTab,
    handleOffer,
    handlerEditOffer,
    handlerDuplicateOffer,
    userDtls,
  }) => {
    // Filter the offers based on the selected tab
    const filteredOffersList = offersList?.filter(
      (ele) => ele?.status === offersListTab
    );
    const renderRow = ({ index, style }) => {
      const ele = filteredOffersList[index];
      return (
        <div style={style}>
          <CompanyOffersList
            data={ele}
            handleOffer={handleOffer}
            handlerEditOffer={handlerEditOffer}
            handlerDuplicateOffer={handlerDuplicateOffer}
            isAdmin={userDtls?.type === "admin"}
          />
        </div>
      );
    };
    return (
      <List
        height={700} // The height of the virtualized list container
        itemCount={filteredOffersList.length} // Total number of items after filtering
        itemSize={itemSize} // Adjust based on the height of each item //! here need to set the phone view
        width={"100%"} // Width of the list
      >
        {renderRow}
      </List>
    );
  };

  const checkDuplicate = (array, obj) => {
    // Array.isArray(array) ? array : arra``
    const index = array?.findIndex((item) => item?.id === obj?.id);
    if (index !== -1) {
      return array?.filter((item) => item?.id !== obj?.id);
    } else {
      return [...array, obj];
    }
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
        {cardSelected && (
          <MyButton
            type="backButton"
            onClick={() => {
              setSelectedData({});
              setCardSelected(false);
            }}
          />
        )}
        <Typography
          className="CardTitle"
          fontWeight="800"
          variant="h4"
          color="gray"
        >
          {cardSelected ? selectedData?.title : "Offers"}
        </Typography>
        {cardSelected ? (
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
                  selectedData?.availableDates?.from,
                  "DD/MM"
                )}-${formatDate(selectedData?.availableDates?.to, "DD/MM")}`}
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
        ) : (
          <>
            {userDtls?.type != "admin" && (
              <MyButton
                onClick={() => {
                  setOfferType("Create");
                  setIsShowCreateOffers(true);
                }}
                className="addIcon btn"
                color="secondary"
                sx={{
                  borderRadius: 4,
                  fontWeight: 700,
                  border: 1,
                  borderColor: "secondary",
                }}
                startIcon={<AddIcon margin={0} sx={{ margin: "0px" }} />}
              >
                <span className="checkIcon-text">Create offers</span>
              </MyButton>
            )}
          </>
        )}
      </Box>
    );
  };

  /**
   * To view offer list
   * @returns Jsx element
   */
  const OffersListContainer = () => {
    return (
      <TabContext
        value={offersListTab}
        sx={{ width: "100%" }}
        // className="booking-list"
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleSetOffersTab}
            aria-label="lab API tabs example"
          >
            <Tab
              sx={{ textTransform: "capitalize" }}
              fontWeight={700}
              label="Active"
              value="active"
              color="white"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Drafts"
              value="draft"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Past"
              value="past"
            />
          </TabList>
        </Box>
        {/* <Box
          className="tab-view"
          margin={"5px"}
          display={"flex"}
          sx={{ gap: "5px" }}
        >
          <MyButton
            onClick={() => handleTabFilter("all")}
            className="checkIcon btn"
            color={`${tabFilter === "all" ? "secondary" : "white"}`}
            sx={{
              borderRadius: 1,
              height: "32px",
              boxShadow: "none",
              border: 1,
              borderColor: "#49454f",
            }}
            startIcon={<DoneIcon />}
          >
            All
          </MyButton>
          <MyButton
            onClick={() => handleTabFilter("intrusted")}
            className="checkIcon btn"
            color={`${tabFilter === "intrusted" ? "secondary" : "white"}`}
            sx={{
              borderRadius: 1,
              height: "32px",
              boxShadow: "none",
              border: 1,
              borderColor: "#49454f",
            }}
          >
            Interested
            <Badge
              sx={{ marginLeft: 2 }}
              badgeContent={99}
              color="warning"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            ></Badge>
          </MyButton>
          <MyButton
            onClick={() => handleTabFilter("updates")}
            className="checkIcon btn"
            color={`${tabFilter === "updates" ? "secondary" : "white"}`}
            sx={{
              borderRadius: 1,
              height: "32px",
              boxShadow: "none",
              border: 1,
              borderColor: "#49454f",
            }}
          >
            Updates
            <Badge
              sx={{ marginLeft: 2 }}
              badgeContent={99}
              color="warning"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            ></Badge>
          </MyButton>
        </Box> */}
        <div className="card-view">
          {offersList?.length > 0 ? (
            <>
              <VirtualizedCompanyOffersList
                offersList={offersList}
                offersListTab={offersListTab}
                handleOffer={handleOffer}
                handlerEditOffer={handlerEditOffer}
                handlerDuplicateOffer={handlerDuplicateOffer}
                userDtls={userDtls}
              />
            </>
          ) : (
            <Box
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
        </div>
      </TabContext>
    );
  };
  /**
   * To company handle the approve influencer request
   */
  const handlerApproveOrIgnoreRequest = async (userId, isApproved) => {
    try {
      startLoading();
      const payload = {
        offerId: selectedData?._id,
        newStatus: isApproved ? "offeredToInfluencer" : "rejectedOffers",
        influencerId: userId,
      };
      const response = await updateBookingStatus(payload).unwrap();
      if (response?.data) {
        fetchOfferById(selectedData?._id);
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
        setSelectedData(response.data[0]);
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
      {cardSelected ? (
        <>
          <TabContext
            value={offersCardTab}
            sx={{ padding: "5px", width: "100%" }}
          >
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
            <TabPanel
              // className="offers-card-tab"
              padding="5"
              sx={{ width: "100%" }}
              value="status"
            >
              <Box
                className="tab-view"
                margin={"5px"}
                display={"flex"}
                sx={{ gap: "5px" }}
              >
                <MyButton
                  onClick={() => handlerTabCardFilter("pending")}
                  className="checkIcon btn"
                  color={`${
                    tabCardFilter === "pending" ? "secondary" : "white"
                  }`}
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
                      {selectedData?.requestToBusiness?.length || ""}
                    </span>
                  </Badge>
                </MyButton>
                <MyButton
                  onClick={() => handlerTabCardFilter("approved")}
                  className="checkIcon btn"
                  color={`${
                    tabCardFilter === "approved" ? "secondary" : "white"
                  }`}
                  sx={{
                    borderRadius: 1,
                    height: "32px",
                    boxShadow: "none",
                  }}
                >
                  Booked
                  <Badge sx={{ marginLeft: 2 }}>
                    <span className="badge">{`${selectedData?.spots?.booked}/${selectedData?.spots?.availableSpots}`}</span>
                  </Badge>
                </MyButton>
                <MyButton
                  onClick={() => handlerTabCardFilter("rejected")}
                  className="checkIcon btn"
                  color={`${
                    tabCardFilter === "rejected" ? "secondary" : "white"
                  }`}
                  sx={{
                    borderRadius: 1,
                    height: "32px",
                    boxShadow: "none",
                  }}
                  // startIcon={<DoneIcon />}
                >
                  Rejected
                </MyButton>
              </Box>

              <div className="card-status">
                {selectedData[offerFilterCode[tabCardFilter]]?.map(
                  (ele, index) => {
                    return (
                      <Box
                        className="btn action-btn bg-color "
                        color="light2"
                        // border={"1px solid"}
                        // borderColor={"gray"}
                        display={"flex"}
                        flexDirection={"column"}
                        sx={{
                          color: "secondary",
                          // height: "64px",
                          padding: "8px",
                          border: "1px",
                          // borderColor: "primary",
                          borderRadius: "7px",
                          margin: "5px",
                          // maxWidth: "380px",
                          // width: "380px",
                        }}
                      >
                        {/* <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={" space-between"}
                    className="profileBtn bg-color"
                  > */}
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
                            src={influencerCardIcon}
                            alt="loading"
                          ></img>
                          <Stack
                            direction={"row"}
                            gap={2}
                            alignItems={"center"}
                            i
                          >
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
                        {/* <Stack>
                      {index % 2 === 0 && (
                        <MyButton
                          color="white"
                          sx={{
                            height: "32px",
                            padding: "8px",
                            boxShadow: "none",
                          }}
                          startIcon={<GroupAddIcon />}
                        >
                          {2}
                        </MyButton>
                      )}
                    </Stack> */}
                        <Stack
                          gap={2}
                          direction={"row"}
                          marginBottom={2}
                          justifyContent={"center"}
                        >
                          {tabCardFilter === "pending" && (
                            <MyButton
                              // disabled={selectedData?.rejectedOffers?.find(
                              //   (item) => item?.userId === ele?.userId
                              // )}
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
                              // className="btn"
                            >
                              {selectedData?.rejectedOffers?.find(
                                (item) => item?.userId === ele?.userId
                              )
                                ? "Request ignored"
                                : "Ignore"}
                            </MyButton>
                          )}
                          {/* {!selectedData?.rejectedOffers?.find(
                            (item) => item?.userId === ele?.userId
                          ) && ( */}
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
                              // borderColor: "secondary",
                              bgcolor:
                                tabCardFilter === "approved"
                                  ? "green.main"
                                  : "light.main",
                            }}
                            startIcon={<CheckIcon />}
                          >
                            {tabCardFilter === "approved"
                              ? `Check-in :${formatDate(
                                  selectedData?.availableDates?.to,
                                  "DD/MM"
                                )}`
                              : "Approve request"}
                          </MyButton>
                          {/* )} */}
                        </Stack>
                        {/* </Box> */}
                      </Box>
                    );
                  }
                )}
                {selectedData[offerFilterCode[tabCardFilter]]?.length === 0 && (
                  <Box
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography
                      fontWeight="700"
                      variant="body1"
                      color="primary"
                    >
                      No data found.
                    </Typography>
                  </Box>
                )}
              </div>
            </TabPanel>
            <TabPanel
              className="c-offers-content"
              sx={{ width: "100%" }}
              value="content"
            >
              <OfferDetails offerId={selectedData?._id} />
            </TabPanel>
            <TabPanel
              sx={{
                width: "100%",
                height: "calc(100vh - 132px)",
                overflow: "hidden auto",
              }}
              value="request"
            >
              <CompanyOffersRequest data={selectedData} />
            </TabPanel>
          </TabContext>
        </>
      ) : (
        <>
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{ padding: 1, gap: "5px", marginLeft: "5px" }}
          >
            <SearchBar
              setQuery={setQuery}
              query={query}
              handlerFetchOffers={handlerFetchOffers}
              placeholder="search offer"
            />
            <TuneIcon onClick={() => handleOpen()} />
          </Box>
          <OffersListContainer />
        </>
      )}
      {isShowCreateOffers && (
        <CreateOffers
          offerType={offerType}
          editOfferDtls={{ ...editOfferDtls }}
          open={isShowCreateOffers}
          setOpen={handlerCloseCreateOfferModal}
          handlerFetchOffers={handlerFetchOffers}
        />
      )}

      {/* Filter modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isShowFilter}
        onClose={setIsShowFilter}
        closeAfterTransition
      >
        <Box
          className="filter-modal"
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #e8def8",
            borderRadius: "15px",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Filter
            </Typography>
            <IconButton color="primary" onClick={() => setIsShowFilter(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {/* <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Types"
            value={
              filterDtls?.categories?.map((ele) => ele.value)?.join(", ") || []
            } // Display selected types
            // defaultValue={filterDtls?.categories || null}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="end">
                  <ToggleOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f3f3f3",
              },
            }}
          ></TextField> */}
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2} gap={1}>
            {categoryList?.map((ele, index) => (
              <Chip
                key={index}
                label={ele?.value}
                clickable
                sx={{ color: "primary" }}
                color={
                  filterDtls?.categories?.find((item) => item?.id === ele?.id)
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handlerOnchange("categories", ele)}
                // sx={{ mb: 1 }}
              />
            ))}
          </Stack>
          <Typography
            id="transition-modal-title"
            variant="body1"
            component="h2"
            mt={1}
          >
            From Date
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  colo
                  color={"primary"}
                  sx={{ borderBlockColor: "primary", color: "primary" }}
                  value={dateList?.fromDate?.start || null}
                  onChange={(e) => {
                    handlerDateOnchange("fromDate", "start", e);
                  }}
                  // disablePast
                  label="Start date..."
                />
                <DatePicker
                  value={
                    dateList?.fromDate?.end || dateList?.fromDate?.start || null
                  }
                  // disabled={!dateList.start}
                  minDate={dayjs(new Date(dateList?.fromDate?.start)).add(
                    2,
                    "day"
                  )}
                  label="End date..."
                  onChange={(e) => {
                    handlerDateOnchange("fromDate", "end", e);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
          <Typography
            id="transition-modal-title"
            variant="body1"
            component="h2"
            sx={{ marginTop: "5px" }}
          >
            To Date
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={dateList?.toDate?.start || null}
                  onChange={(e) => {
                    handlerDateOnchange("toDate", "start", e);
                  }}
                  disablePast
                  label="Start date..."
                />
                <DatePicker
                  value={
                    dateList?.toDate?.start || dateList?.toDate?.end || null
                  }
                  // disabled={!dateList.start}
                  minDate={dayjs(new Date(dateList?.toDate?.start)).add(
                    2,
                    "day"
                  )}
                  label="End date..."
                  onChange={(e) => {
                    handlerDateOnchange("toDate", "end", e);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
          <Box
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: "100%",
                borderBottom: "1px solid gray",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <LocationAutoComplete
              setLocation={setLocation}
              value={location}
              setFilterLocation={setFilterLocation}
            />
          </Box>

          {/* <Divider sx={{ color: "dark.main" }} /> */}
          <Box
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: "100%",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Preference"
              variant="standard"
            />
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
              onClick={handleClearFilters}
            >
              Clear all filters
            </MyButton>
            <MyButton
              disabled={
                !dateList?.fromDate?.start &&
                !dateList?.toDate?.start &&
                !filterDtls?.location?.length > 0 &&
                !filterDtls?.categories?.length > 0 &&
                !filterDtls?.name > 0 &&
                !location?.locationName?.length > 0
              }
              onClick={() => {
                handlerFetchOffers();
                setIsShowFilter(false);
              }}
              sx={{
                width: "50%",
                borderRadius: "15px",
                borderColor: "text.secondary",
              }}
            >
              Apply
            </MyButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};
export default CompanyOffer;
