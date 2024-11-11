import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Fade,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Switch from "@mui/material/Switch";
import DialogTitle from "@mui/material/DialogTitle";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MyButton from "../../MyButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { DateTimeRangePickerDemoItem } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import OfferDetails from "../../OfferDetails/OfferDetails";
import { categoryList } from "../../../utils/constants";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useUploadImageMutation,
} from "../../../services/apiService/userApiService";
import toaster from "../../Toaster/toaster";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import useLoading from "../../../hooks/useLoading";
import LocationAutoComplete from "../../LocationAutoComplete/LocationAutoComplete";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, HashNavigation } from "swiper/modules";
import "swiper/css"; // Basic Swiper styles
import "swiper/css/virtual";

const CreateOffers = ({
  open,
  setOpen,
  handlerFetchOffers,
  editOfferDtls,
  handlerDuplicateOffer,
  offerType,
}) => {
  console.log("editOfferDtls :", editOfferDtls, offerType);
  const { userDtls } = useSelector((state) => state?.auth);
  const [createOffer] = useCreateOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();
  const [imageUpload] = useUploadImageMutation();
  const { startLoading, stopLoading } = useLoading();
  const [blockDate, setBlockData] = useState("");
  const [location, setLocation] = useState({});
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const createOfferInitialValue = {
    title: "",
    description: "",
    location: {},
    requirement: {},
    availableDates: { from: "", to: "" },
    spots: {
      availableSpots: 0,
      booked: 0,
    },
    status: "active",
    categories: [],
    offerImages: [],
    followerCount: 0,
  };
  const requireDtlsInitialValue = {
    instagram: {
      opened: false,
      list: [
        {
          name: "Post",
          opened: false,
          count: 0,
          description: [],
        },
        { name: "Story", opened: false, count: 0, description: [] },
        { name: "Reels", opened: false, count: 0, description: [] },
      ],
    },
  };
  const [openQuickDateFilter, setOpenQuickDateFilter] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadFile, setUploadFile] = useState([]);
  const [dateList, setDateList] = useState({});
  const [numberValue, setNumberValue] = useState(0);
  // const [dateList1, setDateList1] = useState({});
  const [createOffersDtls, setCreateOffersDtls] = useState(
    createOfferInitialValue
  );
  const handleClose = () => {
    handlerClear();
    setOpen(false);
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [openCat, setOpenCat] = useState({
    what: false,
    when: false,
    where: false,
    who: false,
  });
  const [requestDtls, setRequestDtls] = useState(requireDtlsInitialValue);

  useEffect(() => {
    if (editOfferDtls._id && offerType !== "Create") {
      if (editOfferDtls?.followerCount > 0) {
        setIsSwitchOn(false);
      }
      setCreateOffersDtls(editOfferDtls);
      setLocation(editOfferDtls?.location);
      setRequestDtls({
        ...requestDtls,
        instagram: {
          ...requestDtls?.instagram,
          list: editOfferDtls?.requirement?.map((ele) => ({
            ...ele,
            opened: ele?.description?.length > 0 ? true : false,
          })),
        },
      });
      if (offerType !== "Duplicate") {
        setDateList({
          start: dayjs(editOfferDtls?.availableDates?.from),
          end: dayjs(editOfferDtls?.availableDates?.to),
        });
      } else {
        setDateList({});
      }
      setUploadFile(editOfferDtls?.offerImages);
    }
  }, [open]);

  /**
   * To handle the create offer
   */
  const handlerCreateOrUpdateOffer = async (type) => {
    startLoading();
    try {
      const { _id, ...payload } = { ...createOffersDtls };
      let editImage = [];
      if (editOfferDtls?._id) {
        //Need to implement
        editImage = uploadFile?.filter((ele) => typeof ele !== "string");
        const formData = new FormData();
        Array.from(editImage)?.forEach((file) => {
          formData?.append("files", file);
        });
        const imageUrl = await imageUpload(formData)?.unwrap();
        payload.offerImages = [
          ...(imageUrl?.data || []),
          ...uploadFile?.filter((ele) => typeof ele === "string"),
        ];
      } else {
        const formData = new FormData();
        Array.from(uploadFile)?.forEach((file) => {
          formData?.append("files", file);
        });
        const imageUrl = await imageUpload(formData)?.unwrap();
        if (imageUrl?.data?.length > 0) {
          payload.offerImages = imageUrl?.data;
        } else {
          toaster("error", imageUrl?.message);
          return;
        }
      }
      payload.requirement = requestDtls?.instagram?.list?.map((ele) => {
        return {
          name: ele?.name,
          count: ele?.count,
          description: ele?.description,
        };
      });
      payload.location = location;
      payload.createdBy = userDtls?.userId;
      payload.availableDates = { ...payload.availableDates };
      payload.availableDates.from = dateList?.start;
      payload.availableDates.to = dateList?.end;
      if (type) payload.status = type;
      let response;
      if (offerType === "Edit") {
        payload._id = editOfferDtls?._id;
        response = await updateOffer(payload).unwrap(); // For update offer
      } else {
        delete payload?._id;
        response = await createOffer(payload).unwrap(); // For create offer
      }
      if (response?.data) {
        toaster(
          "success",
          editOfferDtls?._id
            ? "Offer updated successfully"
            : "Offer created successfully"
        );
        setCreateOffersDtls({ ...createOfferInitialValue });
        setOpen(false);
        handlerClear();
        handlerFetchOffers(true);
      } else {
        toaster(
          "error",
          editOfferDtls?._id ? "Offer updated failed" : "Offer created failed"
        );
      }
    } catch (err) {
      console.error(
        editOfferDtls?._id ? "Offer updated failed" : "Offer created failed",
        err
      );
      toaster("error", "Something went wrong");
    } finally {
      stopLoading();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files; // This is a FileList object
    setUploadFile((prevFiles) => [...prevFiles, ...Array.from(files)]); // Convert FileList to Array
  };
  /**
   * To handle changes in input field
   */
  const handlerOnchange = (key1, value, key2) => {
    if (key1 === "spots") {
      value = value > 0 ? parseInt(value) : 0;
    }
    if (key2) {
      setCreateOffersDtls({
        ...createOffersDtls,
        [key1]: {
          ...createOffersDtls[key1],
          [key2]: value || "",
        },
      });
    } else {
      setCreateOffersDtls({
        ...createOffersDtls,
        [key1]:
          Array.isArray(createOffersDtls[key1]) && key1 === "categories"
            ? checkDuplicate(createOffersDtls[key1], value)
            : value?.name || value || "",
      });
    }
  };
  const checkDuplicate = (array, obj) => {
    const index = array?.findIndex((item) => item?.id === obj?.id);
    if (index !== -1) {
      return array?.filter((item) => item?.id !== obj?.id);
    } else {
      return [...array, obj];
    }
  };
  /**
   * To handler expand less and more
   */
  const handleExpand = (key, value) => {
    setOpenCat((prev) => {
      return { ...prev, [key]: value };
    });
  };
  /**
   * To handle social media link count increment and decrement
   */
  const handlerCountIncrementOrDecrement = (isAdd, index1, value) => {
    setRequestDtls((prev) => {
      const tempList = [...requestDtls?.instagram?.list];
      tempList[index1] = {
        ...tempList[index1],
        count: value,
        // description: isAdd
        //   ? tempList[index1].description.push("")
        //   : tempList[index1].description.pop(),
      };
      if (isAdd) {
        tempList[index1] = {
          ...tempList[index1],
          description: [...tempList[index1]?.description, ""],
        };
      } else {
        tempList[index1].description.pop();
      }
      return {
        ...prev,
        instagram: {
          ...requestDtls?.instagram,
          list: tempList,
        },
      };
    });
  };
  /**
   * To handler add request expand less and more
   */
  const handleRequestExpand = (key, value, index1, index2) => {
    if (index1 !== undefined) {
      if (key === "opened" && !value) {
        setRequestDtls((prev) => {
          const tempList = [...requestDtls?.instagram?.list];
          tempList[index1] = {
            ...tempList[index1],
            opened: value,
            count: 0,
            description: [],
          };
          return {
            ...prev,
            instagram: {
              ...requestDtls?.instagram,
              list: tempList,
            },
          };
        });
      } else {
        setRequestDtls((prev) => {
          const tempList = [...requestDtls?.instagram?.list];
          if (index2 !== undefined) {
            tempList[index1][key][index2] = value;
          } else {
            tempList[index1][key] = value;
          }
          return {
            ...prev,
            instagram: {
              ...requestDtls?.instagram,
              list: tempList,
            },
          };
        });
      }
    } else {
      setRequestDtls((prev) => {
        return {
          ...prev,
          instagram: {
            ...requestDtls?.instagram,
            [key]: value,
          },
        };
      });
    }
  };
  // const handleRequestExpand = (key, value, index1, index2) => {
  //   setRequestDtls((prev) => {
  //     const instagram = { ...prev.instagram }; // Copy instagram object
  //     const tempList = [...(instagram.list || [])]; // Shallow copy of the list

  //     // If index1 is provided, modify the nested structure
  //     if (index1 !== undefined) {
  //       // Deep clone the item at index1 to ensure it's not frozen
  //       const itemAtIndex1 = { ...tempList[index1] };

  //       if (index2 !== undefined) {
  //         // Ensure the key you're updating is a copy
  //         itemAtIndex1[key] = [...(itemAtIndex1[key] || [])];
  //         // Now update the specific element in the nested array
  //         itemAtIndex1[key][index2] = value;
  //       } else {
  //         // Directly update the key with the value
  //         itemAtIndex1[key] = value;
  //       }

  //       // Replace the modified item back into the copied list
  //       tempList[index1] = itemAtIndex1;
  //     } else {
  //       // If index1 is not provided, just update the key directly in instagram
  //       instagram[key] = value;
  //     }

  //     return {
  //       ...prev,
  //       instagram: {
  //         ...instagram,
  //         list: tempList,
  //       },
  //     };
  //   });
  // };

  /**
   * To handle clear function
   */
  const handlerClear = () => {
    setStep(1);
    setCreateOffersDtls({ ...createOfferInitialValue });
    setUploadFile([]);
    setDateList({});
    setRequestDtls(requireDtlsInitialValue);
    console.log("uploadFile after close: ", uploadFile);
  };
  /**
   * To set next button disable
   */
  const isNextDisabled = () => {
    if (step === 1) {
      const { description, title, spots, followerCount, categories } =
        createOffersDtls || {};

      return (
        !description ||
        !title ||
        !spots?.availableSpots ||
        uploadFile.length === 0 ||
        !categories.length > 0 ||
        !dateList?.start ||
        !dateList?.end ||
        !location?.locationName?.length > 0 ||
        (!isSwitchOn && followerCount <= 0)
      );
    }

    if (step === 2) {
      let count = 0;
      const disabled = (requestDtls?.instagram?.list || []).some((ele) => {
        if (ele?.opened) {
          const descriptionCount = ele.description?.filter(Boolean).length || 0;
          count = ele.count || 0;
          return ele.count !== descriptionCount;
        }
        return false;
      });
      return disabled || count === 0;
    }
    return false;
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        height={"100vh"}
      >
        <Fade in={open}>
          <Box
            className="filter-modal"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            sx={{
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 600,
              height: "100%",
              bgcolor: "background.paper",
              border: "2px solid #e8def8",
              boxShadow: 24,
              padding: 2,
              Padding: 1,
            }}
          >
            <Stack
              direction={"row"}
              gap={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              marginBottom={2}
            >
              <ArrowBackIcon
                onClick={() => {
                  if (step === 1) {
                    handleClose();
                    setOpen(false);
                  }

                  setStep((prev) => prev - 1 || 1);
                }}
              />
              <Typography variant="h5" color="gray">
                {step === 1
                  ? `${offerType} offer`
                  : step === 2
                  ? "Add request"
                  : `Preview ${createOffersDtls?.title}`}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => {
                  handleClose();
                  setOpen(false);
                  setStep(1);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
            <Box sx={{ overflow: "hidden auto" }}>
              {step === 1 && (
                <>
                  <Stack direction={"column"} overflow={"auto"}>
                    {/* What */}
                    <Box
                      // ! what
                      padding={2}
                      border={1}
                      borderColor={"secondary"}
                      borderRadius={3}
                      display={"flex"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                      boxShadow={3}
                      marginBottom={2}
                      justifyContent={"space-between"}
                    >
                      <Stack
                        width={"100%"}
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        color={"primary"}
                      >
                        <Stack
                          direction={"row"}
                          gap={3}
                          width={"100%"}
                          color="primary"
                          marginBottom={1}
                        >
                          <LocalOfferOutlinedIcon color="primary" />
                          <span>What</span>
                          <InfoOutlinedIcon color="primary" />
                        </Stack>
                        {openCat.what ? (
                          <ExpandLessOutlinedIcon
                            onClick={() => {
                              handleExpand("what", false);
                            }}
                          />
                        ) : (
                          <ExpandMoreOutlinedIcon
                            onClick={() => {
                              handleExpand("what", true);
                            }}
                          />
                        )}
                      </Stack>

                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection="column"
                        gap={1}
                      >
                        {openCat.what && (
                          <>
                            <Typography variant="h7" letterSpacing={"-0.06em"}>
                              Add you best image.
                            </Typography>
                            {uploadFile?.length > 0 && (
                              <Box
                                height={221}
                                overflow={"auto hidden "}
                                display={"flex"}
                                justifyContent={"center"}
                                sx={{ marginBottom: 2 }}
                              >
                                <Swiper
                                  className="c-offers-scroll"
                                  modules={[
                                    Virtual,
                                    Navigation,
                                    HashNavigation,
                                  ]}
                                  navigation={true}
                                  hashNavigation={true}
                                  spaceBetween={4}
                                  slidesPerView={
                                    uploadFile?.length < 4
                                      ? uploadFile?.length
                                      : 4
                                  }
                                  virtual
                                >
                                  {uploadFile?.map((ele, index) => {
                                    return (
                                      <Box
                                        position={"relative"}
                                        key={index}
                                        minWidth={136}
                                        height={205}
                                        sx={{
                                          boxShadow: 3,
                                          margin: 1,
                                          color: "gray",
                                          borderRadius: "20px",
                                        }}
                                      >
                                        <SwiperSlide
                                          key={`offer-image-${index}`}
                                          virtualIndex={index}
                                        >
                                          <img
                                            key={index}
                                            src={
                                              typeof ele === "string"
                                                ? ele
                                                : URL.createObjectURL(ele)
                                            }
                                            className="c-offers-scroll"
                                            style={{
                                              display: "block",
                                              height: "100%",
                                              margin: "auto",
                                              width: "100%",
                                              objectFit: "cover",
                                            }}
                                            alt="loading"
                                          />

                                          <IconButton
                                            sx={{
                                              position: "absolute",
                                              top: 0,
                                              right: 0,
                                            }}
                                            color="gray"
                                            onClick={() => {
                                              setUploadFile((prev) => {
                                                const dup = [...prev];
                                                dup?.splice(index, 1);
                                                return dup;
                                              });
                                            }}
                                          >
                                            <CloseIcon />
                                          </IconButton>
                                        </SwiperSlide>
                                      </Box>
                                    );
                                  })}
                                </Swiper>
                              </Box>
                            )}

                            <Button
                              sx={{ textTransform: "capitalize" }}
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              startIcon={<AddOutlinedIcon />}
                              // startIcon={<CloudUploadIcon />}
                            >
                              Add upto 10 images
                              <VisuallyHiddenInput
                                type="file"
                                accept=".jpg, .jpeg, .png,.webp"
                                onChange={handleFileChange}
                                multiple
                              />
                            </Button>
                            <span>Offer title</span>
                            <OutlinedInput
                              value={createOffersDtls?.title}
                              onChange={(e) =>
                                handlerOnchange("title", e?.target?.value)
                              }
                            />
                            <span>Description</span>
                            <TextField
                              id="outlined-multiline-static"
                              multiline
                              rows={2}
                              variant="outlined"
                              fullWidth
                              value={createOffersDtls?.description}
                              onChange={(e) =>
                                handlerOnchange("description", e?.target?.value)
                              }
                            />
                            <span>Categories</span>
                            <Box>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                mb={2}
                                gap={1}
                              >
                                {categoryList?.map((ele, index) => (
                                  <Chip
                                    key={index}
                                    label={ele.value}
                                    clickable
                                    color={
                                      createOffersDtls?.categories?.find(
                                        (item) => item?.id === ele?.id
                                      )
                                        ? "primary"
                                        : "default"
                                    }
                                    onClick={() => {
                                      handlerOnchange("categories", ele);
                                    }}
                                    sx={{ mb: 1 }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                            <span>Available spots</span>
                            <TextField
                              id="outlined-number"
                              value={createOffersDtls?.spots?.availableSpots}
                              // defaultValue={parseInt(
                              //   createOffersDtls?.spots?.availableSpots
                              // )}
                              type="number"
                              onScroll={(e) => {
                                e?.stopPropagation();
                                e?.preventDefault();
                              }}
                              onChange={(e) =>
                                handlerOnchange(
                                  "spots",
                                  e?.target?.value > 0
                                    ? parseInt(e?.target?.value)
                                    : 0,
                                  "availableSpots"
                                )
                              }
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* When */}
                    <Box
                      // !  when
                      padding={2}
                      border={1}
                      borderColor={"secondary"}
                      borderRadius={3}
                      display={"flex"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                      boxShadow={3}
                      marginBottom={2}
                    >
                      <Stack
                        width={"100%"}
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        color={"primary"}
                      >
                        <Stack
                          direction={"row"}
                          gap={3}
                          width={"100%"}
                          color="primary"
                          marginBottom={1}
                        >
                          <CalendarMonthOutlinedIcon color="primary" />
                          <span>When</span>
                          <InfoOutlinedIcon color="primary" />
                        </Stack>
                        {openCat.when ? (
                          <ExpandLessOutlinedIcon
                            onClick={() => {
                              handleExpand("when", false);
                            }}
                          />
                        ) : (
                          <ExpandMoreOutlinedIcon
                            onClick={() => {
                              handleExpand("when", true);
                            }}
                          />
                        )}
                      </Stack>

                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection="column"
                        gap={1}
                      >
                        {openCat.when && (
                          <>
                            <MyButton
                              startIcon={<TuneOutlinedIcon />}
                              onClick={() => setOpenQuickDateFilter(true)}
                            >
                              Quick Filter
                            </MyButton>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              mt={2}
                            >
                              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                  components={["DateTimeRangePicker"]}
                                >
                                  <DemoItem
                                    label="DateTimeRangePicker"
                                    component="DateTimeRangePicker"
                                  >
                                    <DateTimeRangePicker
                                      value={dateList || null}
                                      onChange={(newValue) => {
                                        setDateList(newValue);
                                      }}
                                      disablePast
                                    />
                                  </DemoItem>
                                </DemoContainer>
                              </LocalizationProvider> */}
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    value={dateList.start || null}
                                    onChange={(e) => {
                                      setDateList((prev) => {
                                        return { start: e };
                                      });
                                    }}
                                    disablePast
                                    label="Start date..."
                                  />
                                  <DatePicker
                                    value={dateList.end || null}
                                    disabled={!dateList.start}
                                    minDate={dayjs(
                                      new Date(dateList.start)
                                    ).add(2, "day")}
                                    label="End date..."
                                    onChange={(e) => {
                                      setDateList((prev) => {
                                        return { ...prev, end: e };
                                      });
                                    }}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </Stack>
                          </>
                        )}
                      </Box>
                    </Box>
                    {/* Where */}
                    <Box
                      //! where
                      padding={2}
                      border={1}
                      borderColor={"secondary"}
                      borderRadius={3}
                      display={"flex"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                      boxShadow={3}
                      marginBottom={2}
                    >
                      <Stack
                        width={"100%"}
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        color={"primary"}
                      >
                        <Stack
                          direction={"row"}
                          gap={3}
                          width={"100%"}
                          color="primary"
                          marginBottom={1}
                        >
                          <AddLocationAltOutlinedIcon color="primary" />
                          <span>where</span>
                          <InfoOutlinedIcon color="primary" />
                        </Stack>
                        {openCat.where ? (
                          <ExpandLessOutlinedIcon
                            onClick={() => {
                              handleExpand("where", false);
                            }}
                          />
                        ) : (
                          <ExpandMoreOutlinedIcon
                            onClick={() => {
                              handleExpand("where", true);
                            }}
                          />
                        )}
                      </Stack>

                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection="column"
                        gap={1}
                      >
                        {openCat.where && (
                          <>
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
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                    {/* who */}
                    <Box
                      // ! who
                      padding={2}
                      border={1}
                      borderColor={"secondary"}
                      borderRadius={3}
                      display={"flex"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                      boxShadow={3}
                      marginBottom={2}
                    >
                      <Stack
                        width={"100%"}
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        color={"primary"}
                      >
                        <Stack
                          direction={"row"}
                          gap={3}
                          width={"100%"}
                          color="primary"
                          marginBottom={1}
                        >
                          <GroupAddOutlinedIcon color="primary" />
                          <span>who</span>
                          <InfoOutlinedIcon color="primary" />
                        </Stack>
                        {openCat.who ? (
                          <ExpandLessOutlinedIcon
                            onClick={() => {
                              handleExpand("who", false);
                            }}
                          />
                        ) : (
                          <ExpandMoreOutlinedIcon
                            onClick={() => {
                              handleExpand("who", true);
                            }}
                          />
                        )}
                      </Stack>

                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection="column"
                        gap={1}
                      >
                        {openCat.who && (
                          <>
                            <Typography variant="h7">
                              Filter Influencer Per:
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap={1}
                              paddingLeft={"20px"}
                            >
                              <Switch
                                checked={isSwitchOn}
                                onChange={(event) => {
                                  setIsSwitchOn(event?.target?.checked);
                                  handlerOnchange("followerCount", 0);
                                }}
                              />
                              <Typography>
                                Make available for everyone
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap={2} marginTop={2}>
                              <Typography variant="h7">
                                follower Count:
                              </Typography>
                              <TextField
                                disabled={isSwitchOn}
                                type="number"
                                value={
                                  !isSwitchOn
                                    ? createOffersDtls?.followerCount
                                    : 0
                                }
                                onScroll={(e) => {
                                  e?.stopPropagation();
                                  e?.preventDefault();
                                }}
                                onChange={(e) =>
                                  handlerOnchange(
                                    "followerCount",
                                    e?.target?.value > 0 ? e?.target?.value : 0
                                  )
                                }
                              />
                            </Stack>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </>
              )}
              {step === 2 && (
                <>
                  <Stack direction={"column"} overflow={"auto"}>
                    <Box
                      padding={2}
                      border={1}
                      borderColor={"secondary"}
                      borderRadius={3}
                      display={"flex"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                      boxShadow={3}
                      marginBottom={2}
                      justifyContent={"space-between"}
                    >
                      <Stack
                        width={"100%"}
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        color={"primary"}
                      >
                        <Stack
                          direction={"row"}
                          gap={3}
                          width={"100%"}
                          color="primary"
                          marginBottom={1}
                        >
                          <InstagramIcon color="primary" />
                          <span>Instagram</span>
                        </Stack>
                        {requestDtls.instagram?.opened ? (
                          <ExpandLessOutlinedIcon
                            onClick={() => {
                              handleRequestExpand("opened", false);
                            }}
                          />
                        ) : (
                          <ExpandMoreOutlinedIcon
                            onClick={() => {
                              handleRequestExpand("opened", true);
                            }}
                          />
                        )}
                      </Stack>
                      {requestDtls.instagram?.opened &&
                        requestDtls?.instagram?.list?.map((ele, index) => {
                          return (
                            <>
                              <Stack
                                direction={"row"}
                                alignItems={"center"}
                                gap={2}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={ele?.opened}
                                      onClick={(e) => {
                                        handleRequestExpand(
                                          "opened",
                                          e?.target?.checked,
                                          index
                                        );
                                      }}
                                    />
                                  }
                                  label={
                                    ele?.count
                                      ? `${ele?.count} ${ele?.name}`
                                      : ele?.name
                                  }
                                />
                                {ele?.opened && (
                                  <>
                                    <RemoveOutlinedIcon
                                      onClick={() =>
                                        handlerCountIncrementOrDecrement(
                                          false,
                                          index,
                                          ele.count - 1
                                        )
                                      }
                                    />
                                    <AddOutlinedIcon
                                      onClick={() =>
                                        handlerCountIncrementOrDecrement(
                                          true,
                                          index,
                                          ele.count + 1
                                        )
                                      }
                                      color="Primary"
                                    />
                                  </>
                                )}
                              </Stack>
                              {Array.from({ length: ele?.count })?.map(
                                (_, idx) => {
                                  return (
                                    <>
                                      <span>
                                        {`${ele?.name} Description ${idx + 1} `}
                                      </span>
                                      <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        fullWidth
                                        defaultValue={
                                          ele?.description[idx] || null
                                        }
                                        onChange={(e) =>
                                          handleRequestExpand(
                                            "description",
                                            e?.target?.value,
                                            index,
                                            idx
                                          )
                                        }
                                      />
                                    </>
                                  );
                                }
                              )}
                            </>
                          );
                        })}
                    </Box>
                  </Stack>
                </>
              )}
              {step === 3 && (
                <>
                  <OfferDetails
                    data={{
                      ...createOffersDtls,
                      offerImages: uploadFile,
                      location,
                      requirement: editOfferDtls?._id
                        ? requestDtls?.instagram?.list?.filter(
                            (ele) => ele?.count > 0
                          )
                        : requestDtls?.instagram?.list,
                    }}
                    isInfluencerView={true}
                  />
                </>
              )}
            </Box>
            {step && step > 2 ? (
              <Stack direction={"row"} gap={2}>
                <MyButton sx={{}} startIcon={<VisibilityOffIcon />}></MyButton>
                {offerType === "Edit" && !editOfferDtls.status === "draft" ? (
                  <></>
                ) : (
                  <MyButton
                    sx={{ width: "100%" }}
                    onClick={() => handlerCreateOrUpdateOffer("draft")}
                    startIcon={<AddIcon />}
                  >
                    Save draft
                  </MyButton>
                )}
                <MyButton
                  sx={{ width: "100%" }}
                  onClick={() => handlerCreateOrUpdateOffer("active")}
                >
                  {offerType === "Edit" && !editOfferDtls.status === "draft"
                    ? "Save"
                    : "Publish"}
                </MyButton>
              </Stack>
            ) : (
              <Stack direction={"row"} gap={2}>
                <MyButton sx={{ width: "100%" }} onClick={handlerClear}>
                  Clear
                </MyButton>
                <MyButton
                  sx={{ width: "100%" }}
                  onClick={() => setStep(step + 1)}
                  disabled={isNextDisabled()}
                >
                  Next
                </MyButton>
              </Stack>
            )}
          </Box>
        </Fade>
      </Modal>
      <Dialog
        open={openQuickDateFilter}
        onClose={() => setOpenQuickDateFilter(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Quick Filters</DialogTitle>
        <DialogContent>
          <Stack direction={"row"}>
            <FormControlLabel control={<Checkbox />} label="Next week" />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Next month"
            />
          </Stack>
          <Stack direction={"column"}>
            <span>Settings</span>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Weekends Only"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Weekdays Only"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <MyButton onClick={() => setOpenQuickDateFilter(false)}>
            Apply
          </MyButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CreateOffers;
