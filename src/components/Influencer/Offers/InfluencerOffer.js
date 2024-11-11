import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Chip,
  TextField,
  IconButton,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import MyButton from "../../MyButton";
import ListIcon from "@mui/icons-material/List";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Autocomplete from "@mui/material/Autocomplete";
import TuneIcon from "@mui/icons-material/Tune";
import SearchBar from "../../Search";
import CloseIcon from "@mui/icons-material/Close";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./InfluencerOffers.css";
import InfluencerOffersList from "./InfluencerOffersList";
import PhotoView from "./PhotoView";
import defaultProfileImg from "../../../assets/image/defaultProfileImg.png";
import {
  useGetCompanyOrInfluencerListMutation,
  useGetOffersMutation,
  useGetWishListMutation,
  useUpdateBookingStatusMutation,
} from "../../../services/apiService/userApiService";
import { useSelector } from "react-redux";
import toaster from "../../Toaster/toaster";
import {
  categoryList,
  filterDtlsInitialValue,
  notificationCode,
} from "../../../utils/constants";
import useNotification from "../../../hooks/usePushNotification";
import useLoading from "../../../hooks/useLoading";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import LocationAutoComplete from "../../LocationAutoComplete/LocationAutoComplete";
import { FixedSizeList as List } from "react-window";
import VirtualizedPhotoViewList from "./VirtualizedPhotoViewList";
import VirtualScrollWrapper from "../../virtualScrollWrapper/VirtualScrollWrapper";

const InfluencerOffers = () => {
  const navigate = useNavigate();
  const [getOffers] = useGetOffersMutation();
  const { sendNotification } = useNotification();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [getInfluencerOrCompanyList] = useGetCompanyOrInfluencerListMutation();
  const [getWishList] = useGetWishListMutation();
  const { startLoading, stopLoading } = useLoading();
  const { userDtls, isCompany, instagramData } = useSelector(
    (state) => state?.auth
  );
  const [offersList, setOffersList] = useState([]);
  const [location, setLocation] = useState({});
  const [filterLocation, setFilterLocation] = useState({});
  const [nameList, setNameList] = useState([]);
  const [filterDtls, setFilterDtls] = useState(filterDtlsInitialValue);
  const [query, setQuery] = useState("");
  const [itemSize, setItemSize] = useState(150);
  const [dateList, setDateList] = useState({
    fromDate: { start: "", end: "" },
    toDate: { start: "", end: "" },
  });
  const [filterCode, setFilterCode] = useState("new");
  const [pageView, setPageView] = useState("list");
  const [open, setOpen] = useState(false);
  /**
   * To handler fetch offers list
   */
  const handlerFetchOffers = async (noFilter, query) => {
    try {
      startLoading();
      let filter = {};
      if (noFilter) {
        filter.status = "active";
      } else {
        filter = { ...filterDtls };
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
      filter.followerCount = instagramData?.followers_count || 0;
      const response = await getOffers({
        id: userDtls?.userId,
        filter,
      }).unwrap();
      if (response?.data) {
        offersListFormatter(response?.data);
      } else {
        setOffersList([]);
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
        setItemSize(200); // Smaller item size for mobile screens
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

  const offersListFormatter = (data) => {
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
    // const arr = Array.from({ length: 20 }).fill(formattedData[0]);
    setOffersList(formattedData);
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
        handlerFetchOffers(true);
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
   * To fetch the wish list
   */
  const fetchWishList = async (id) => {
    try {
      startLoading();
      const response = await getWishList(userDtls?.userId);
      if (response?.data) {
        offersListFormatter(
          response?.data?.data?.map((ele) => ele?.offer) || []
        );
      } else {
        setOffersList([]);
        toaster("error", response?.message);
      }
    } catch (err) {
      if (err?.data?.message) {
      } else {
        console.error("Failed to fetch wish list:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To handle select offer card
   */
  const handleSelectOffersCard = (data) => {
    navigate(`/offers/${data?._id}`);
  };

  const handleClearFilters = () => {
    setFilterDtls({ ...filterDtlsInitialValue });
    setDateList({
      fromDate: { start: "", end: "" },
      toDate: { start: "", end: "" },
    });
    setLocation({});
    setFilterLocation({});
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

  const checkDuplicate = (array, obj) => {
    const index = array.findIndex((item) => item?.id === obj?.id);
    if (index !== -1) {
      return array.filter((item) => item?.id !== obj?.id);
    } else {
      return [...array, obj];
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * To handle the filler funtion
   */
  const handleFilter = (code) => {
    setFilterCode(code);
    if (code === "new") {
      handlerFetchOffers(true);
    } else if (code === "saved") {
      fetchWishList();
    }
  };

  /**
   * To handle the page view
   */
  const handlePageView = (code) => {
    setPageView(code);
  };

  /**
   * for date range
   */
  const handleSelectDateRange = (rangeType) => {
    const today = dayjs();
    let startDate = today;
    let endDate = today;

    switch (rangeType) {
      case "today":
        startDate = today;
        endDate = today;
        break;
      case "yesterday":
        startDate = today.subtract(1, "day");
        endDate = today.subtract(1, "day");
        break;
      case "lastWeek":
        startDate = today.subtract(7, "day");
        endDate = today;
        break;
      case "last15Days":
        startDate = today.subtract(15, "day");
        endDate = today;
        break;
      case "lastMonth":
        startDate = today.subtract(1, "month").startOf("month");
        endDate = today.subtract(1, "month").endOf("month");
        break;
      case "thisMonth":
        startDate = today.startOf("month");
        endDate = today.endOf("month");
        break;
      default:
        return;
    }

    handlerDateOnchange("toDate", "start", startDate);
    handlerDateOnchange("toDate", "end", endDate);
  };

  /**
   * for virtual scroll
   * */
  const InfluencerOffersListVirtual = ({ index, style, data }) => {
    const ele = data[index]; // Get the current item
    return (
      <div style={style}>
        <InfluencerOffersList
          data={ele}
          style={{ overFlow: "auto" }}
          handleSelectOffersCard={handleSelectOffersCard}
          module={"offer"}
          handlerUpdateBookingStatus={handlerUpdateBookingStatus}
          handlerFetchOffers={handlerFetchOffers}
          isSavedOffer={filterCode === "saved" || ele?.isOfferSaved || false}
        />
      </div>
    );
  };

  return (
    <>
      <Box sx={{ padding: 1, margin: 1 }}>
        {/* )} */}
        <Box className="influencerListHeader">
          <Stack
            className="filterCtn"
            direction={"row"}
            sx={{ border: 1, borderRadius: 6, marginRight: "auto" }}
          >
            <MyButton
              className={` btn ${filterCode === "new" ? "active-btn" : ""}`}
              onClick={() => handleFilter("new")}
              sx={{
                borderRadius: "22px 0  0  22px",
                borderColor: "text.secondary",
                minWidth: "50px",
              }}
              variant="text"
            >
              New
            </MyButton>
            <MyButton
              onClick={() => handleFilter("saved")}
              className={` btn ${filterCode === "saved" ? "active-btn" : ""}`}
              sx={{
                minWidth: "50px",
                borderLeft: 1,
                borderRadius: 0,
                borderColor: "text.secondary",
              }}
              variant="text"
            >
              Saved
            </MyButton>
            <MyButton
              onClick={() => handleFilter("expired")}
              className={` btn ${filterCode === "expired" ? "active-btn" : ""}`}
              sx={{
                sm: { width: "60px" },
                borderLeft: 1,
                borderRadius: "0 22px 22px  0  ",
                borderColor: "text.secondary",
              }}
              variant="text"
            >
              Expiring soon
            </MyButton>
          </Stack>
          <Box
            className="searchCtn"
            display={"flex"}
            alignItems={"center"}
            sx={{ gap: "5px" }}
          >
            <SearchBar
              query={query}
              setQuery={setQuery}
              handlerFetchOffers={handlerFetchOffers}
              placeholder="search offer"
            />
            <TuneIcon onClick={() => handleOpen()} />
          </Box>
          <Stack
            direction={"row"}
            gap={"5px"}
            alignItems={"center"}
            className="viewCtn"
          >
            <IconButton
              className={` ${pageView === "list" ? "active-btn" : ""}`}
              onClick={() => handlePageView("list")}
              color="primary"
              sx={{ height: "40px", width: "40px" }}
            >
              <ListIcon />
            </IconButton>
            <IconButton
              className={` ${pageView === "photo" ? "active-btn" : ""}`}
              onClick={() => handlePageView("photo")}
              color="primary"
              sx={{ height: "40px", width: "40px" }}
            >
              <InsertPhotoIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
      <div className="card-view">
        {pageView === "list" && (
          <List
            height={700} // Set the height of the scrollable area
            itemCount={offersList?.length || 0} // Number of items
            itemSize={itemSize} // Height of each item //! here need to set the phone view
            width={"100%"} // Width of the list
            itemData={offersList} // Pass your list data
          >
            {InfluencerOffersListVirtual}
          </List>
        )}
        {pageView === "photo" && (
          <div className="photoViewContainer">
            <VirtualizedPhotoViewList
              offersList={offersList}
              handleSelectOffersCard={handleSelectOffersCard}
              handlerFetchOffers={handlerFetchOffers}
              handlerUpdateBookingStatus={handlerUpdateBookingStatus}
              filterCode={filterCode}
            />
            {/* {offersList.map((ele, index) => {
              return (
                <PhotoView
                  style={{ overFlow: "auto" }}
                  data={ele}
                  handleSelectOffersCard={handleSelectOffersCard}
                  handlerFetchOffers={handlerFetchOffers}
                  handlerUpdateBookingStatus={handlerUpdateBookingStatus}
                  key={index}
                  isSavedOffer={
                    filterCode === "saved" || ele?.isOfferSaved || false
                  }
                ></PhotoView>
              );
            })} */}
          </div>
        )}
        {offersList?.length === 0 && (
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
      {/* Filter modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
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
            <IconButton color="primary" onClick={handleClose}>
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
              />
            ))}
          </Stack>
          <Autocomplete
            sx={{ marginBottom: "15px" }}
            mb={"10px"}
            className="name-filter"
            // multiple
            id="tags-standard"
            options={nameList}
            getOptionLabel={(option) => option.username}
            value={filterDtls?.name || null}
            onChange={(event, newValue) => {
              handlerOnchange("name", newValue);
            }}
            renderOption={(props, option) => (
              <li {...props}>
                <Box
                  marginLeft={1}
                  width={"30px"}
                  height={"30px"}
                  borderRadius={"50%"}
                  marginRight={1}
                >
                  <img
                    src={option?.images[0] || defaultProfileImg}
                    alt="loading"
                    width={" 100%"}
                    height={" 100%"}
                  ></img>
                </Box>
                <Typography
                  marginLeft={2}
                  color={"dark.main"}
                  variant="body1"
                  fontWeight={500}
                >
                  {option?.username}
                </Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                color="primary"
                variant="standard"
                label={isCompany ? "Company name" : "Influencer name"}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <>{params.InputProps.startAdornment}</>,
                }}
              />
            )}
          />
          <Stack>
            <Typography
              id="transition-modal-title"
              variant="body1"
              component="h2"
              mt={1}
              sx={{ fontWeight: "600" }}
            >
              Offer completion Date
            </Typography>

            {/* Date Range Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: 2,
                padding: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("today")}
              >
                Today
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("yesterday")}
              >
                Yesterday
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("lastWeek")}
              >
                Last Week
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("last15Days")}
              >
                Last 15 Days
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("lastMonth")}
              >
                Last Month
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelectDateRange("thisMonth")}
              >
                This Month
              </Button>
            </Box>

            {/* From Date Section */}
            <Stack>
              {/* <Typography
                id="transition-modal-title"
                variant="body1"
                component="h2"
                mt={1}
              >
                From Date
              </Typography> */}
              {/* <Stack
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
                      label="Start date..."
                    />
                    <DatePicker
                      value={
                    dateList?.fromDate?.end || dateList?.fromDate?.start || null
                      }
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
              </Stack> */}
              {/* <Typography
                id="transition-modal-title"
                variant="body1"
                component="h2"
                sx={{ marginTop: "5px" }}
              >
                To Date
              </Typography> */}
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
                        dateList?.toDate?.end || dateList?.toDate?.start || null
                      }
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
            </Stack>
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
                !filterDtls?.name &&
                !location?.locationName?.length > 0
              }
              onClick={() => {
                handlerFetchOffers();
                handleClose();
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

export default InfluencerOffers;
