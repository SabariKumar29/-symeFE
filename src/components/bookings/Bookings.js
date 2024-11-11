import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Stack,
  Typography,
  Modal,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import "./Bookings.css";
import InfluencerOffersList from "../Influencer/Offers/InfluencerOffersList";
import PhotoView from "../Influencer/Offers/PhotoView";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import noDataFound from "../../assets/image/noDataFound.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../Search";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  useGetBookingListMutation,
  useUpdateBookingStatusMutation,
} from "../../services/apiService/userApiService";
import {
  categoryList,
  filterDtlsInitialValue,
  notificationCode,
} from "../../utils/constants";
import toaster from "../Toaster/toaster";
import useNotification from "../../hooks/usePushNotification";
import MyButton from "../MyButton";
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import useLoading from "../../hooks/useLoading";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import LocationAutoComplete from "../LocationAutoComplete/LocationAutoComplete";
import { FixedSizeList as List } from "react-window";
const Bookings = () => {
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const { sendNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const { userDtls, userType } = useSelector((state) => state?.auth);
  const [filterDtls, setFilterDtls] = useState(filterDtlsInitialValue);
  // const [dateList, setDateList] = useState([]);
  const [getBookingList] = useGetBookingListMutation();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState({});
  const [filterLocation, setFilterLocation] = useState({});
  const [pageView, setPageView] = useState("list");
  const [tabValue, setTabValue] = React.useState("requestToBusinessList");
  const [itemSize, setItemSize] = useState(100);
  const [dateList, setDateList] = useState({
    fromDate: { start: "", end: "" },
    toDate: { start: "", end: "" },
  });
  const theme = useTheme();
  const [bookingList, setBookingList] = useState([]);
  const [isShowFilter, setIsShowFilter] = useState(false);

  console.log("userDtls", userDtls);

  /**
   * To update booking status
   */
  const handlerUpdateBookingStatus = async (e, data) => {
    try {
      startLoading();
      e.stopPropagation();
      e.preventDefault();
      let payload = {
        offerId: data?._id,
        influencerId: data?.influencerDetails?.userId,
        newStatus: "offeredToInfluencer",
        message: notificationCode?.offerAccepted,
      };
      // let message = "";
      // if (data?.offerStatus === "accept") {
      //   payload.newStatus = "requestToBusiness";
      //   message = notificationCode?.offerRequested;
      // } else if (data?.offerStatus === "approved") {
      //   payload.newStatus = "offeredToInfluencer";
      //   message = notificationCode?.offerAccepted;
      // } else {
      //   console.log("offerStatus:", data?.offerStatus);
      //   payload.newStatus = "completedByInfluencer";
      //   message = notificationCode?.offerCompleted;
      // }
      const response = await updateBookingStatus(payload).unwrap();
      if (response?.data) {
        fetchBookingData();
        sendNotification({
          senderId: userDtls?.userId,
          recipientId: data.influencerDetails.userId,
          message: notificationCode?.offerAccepted,
          isRead: false,
          type: "remainder",
        });
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function samePageLinkNavigation(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }

  function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          // Routing libraries handle this, you can remove the onClick handle when using them.
          if (samePageLinkNavigation(event)) {
            event.preventDefault();
          }
        }}
        aria-current={props.selected && "page"}
        {...props}
      />
    );
  }

  LinkTab.propTypes = {
    selected: PropTypes.bool,
  };

  // Determine if it's a mobile view or web view
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isWeb = useMediaQuery(theme.breakpoints.up("md"));

  const fetchBookingData = async () => {
    try {
      const payload = {
        status: "active",
      };
      if (userDtls?.type === "influencer") {
        payload.influencerId = userDtls?.userId;
      } else if (userDtls?.type === "company") {
        payload.businessId = userDtls?.userId;
      }
      console.log("payload", payload);

      const response = await getBookingList({
        id: userDtls?._id,
        filter: payload,
      });
      console.log("response", response?.data?.data);
      // const arr = Array.from({ length: 20 }).fill(response?.data?.data[0]);
      if (userType === "influencer") {
        const bookingDtls = response?.data?.data[tabValue]?.filter?.(
          (item) => item?.influencerDetails?.userId === userDtls?.userId
        );
        setBookingList(bookingDtls || []);
      } else {
        setBookingList(response?.data?.data[tabValue] || []);
      }
    } catch (error) {
      return;
    }
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

  const checkDuplicate = (array, obj) => {
    // Array.isArray(array) ? array : arra``
    const index = array?.findIndex((item) => item?.id === obj?.id);
    if (index !== -1) {
      return array?.filter((item) => item?.id !== obj?.id);
    } else {
      return [...array, obj];
    }
  };

  const handleClearFilters = () => {
    setFilterDtls({ filterDtlsInitialValue });
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
    fetchBookingData(true);
  };

  useEffect(() => {
    fetchBookingData();
  }, [tabValue]);

  // Dynamically calculate item size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Adjust item size based on the screen width
      if (screenWidth < 768) {
        setItemSize(180); // Smaller item size for mobile screens
      } else if (screenWidth >= 768 && screenWidth < 1024) {
        setItemSize(180); // Medium size for tablets
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

  const InfluencerOffersListVirtual = ({ index, style, data }) => {
    const ele = data[index]; // Get the current item
    return (
      <div style={style}>
        <InfluencerOffersList
          key={ele}
          data={ele}
          module={"booking"}
          showApproveReject={tabValue === "requestToBusinessList"}
          handlerUpdateBookingStatus={handlerUpdateBookingStatus}
          handlerFetchOffers={fetchBookingData}
        />
      </div>
    );
  };

  const Header = () => {
    return (
      <>
        <Box sx={{ padding: 1 }}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="nav tabs example"
              role="navigation"
            >
              <Tab
                sx={{ textTransform: "capitalize" }}
                fontWeight={700}
                label="Pending"
                value="requestToBusinessList"
                color="white"
              />
              <Tab
                sx={{ textTransform: "capitalize" }}
                label="Approved"
                value="offeredToInfluencerList"
              />
              <Tab
                sx={{ textTransform: "capitalize" }}
                label="Completed"
                value="completedByInfluencerList"
              />
            </Tabs>
          </Box>
        </Box>
      </>
    );
  };
  return (
    <>
      <div className="booking">
        {isWeb && <Header />}
        {/* <Stack>
          <Typography
            sx={{
              gap: "10px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchBar
              query={query}
              setQuery={setQuery}
              handlerFetchOffers={fetchBookingData}
              placeholder="search offer"
            />
            <TuneIcon onClick={() => setIsShowFilter(true)} />
          </Typography>
        </Stack> */}
        <div className="booking-list">
          <div className="card-booking-view">
            {pageView === "list" && (
              <List
                height={700} // Set the height of the scrollable area
                itemCount={bookingList?.length || 0} // Number of items
                itemSize={itemSize} // Height of each item
                width={"100%"} // Width of the list
                itemData={bookingList} // Pass your list data
              >
                {InfluencerOffersListVirtual}
              </List>
            )}
            {pageView === "photo" &&
              bookingList[tabValue]?.map((ele) => {
                return <PhotoView></PhotoView>;
              })}
          </div>
          {bookingList[tabValue]?.length === 0 && (
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
        {isMobile && <Header />}
      </div>
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
            <IconButton onClick={() => setIsShowFilter(false)}>
              <CloseIcon sx={{ color: "primary" }} />
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
                color={
                  filterDtls?.categories?.find((item) => item?.id === ele?.id)
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handlerOnchange("categories", ele)}
                sx={{ border: "1px" }}
                // border={1}
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
              setFilterLocation={setFilterLocation}
            />
          </Box>
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
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
                !location?.locationName?.length > 0
              }
              onClick={() => {
                // fetchBookingData();
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
    </>
  );
};

export default Bookings;
