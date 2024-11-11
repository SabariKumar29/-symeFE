import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  useMediaQuery,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toaster from "../../components/Toaster/toaster";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import download from "../../assets/image/download .jpg";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateUserMutation,
  useUploadImageMutation,
} from "../../services/apiService/userApiService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, HashNavigation } from "swiper/modules";
import "swiper/css/virtual";
import "swiper/css/navigation";
import "swiper/css"; // Basic Swiper styles
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LocationAutoComplete from "../../components/LocationAutoComplete/LocationAutoComplete";
import { setUserDetails } from "../../store/Slicers/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch(); //dispatch the user details
  const navigate = useNavigate(); //for navigate to setting page
  const { userDtls, instagramData } = useSelector((state) => state?.auth); //getting data from redux
  const tags = ["lifestyle", "minimal", "chic", "culture", "style"];
  const [imageUpload] = useUploadImageMutation(); // api for upload image
  const [updateUserInfo] = useUpdateUserMutation(); // api for update user details
  const [name, setName] = useState(userDtls?.username); //manage name
  const [location, setLocation] = useState({}); //manage location
  const [openEditDialog, setOpenEditDialog] = useState(false); //manage dialog open or close
  const [coverImage, setCoverImage] = useState(null); //manage cover image
  const [profileImage, setProfileImage] = useState(null); //manage profile image

  /**
   * To handle the profile image change
   * @param {e} event
   */
  const handleProfileImageChange = async (e) => {
    const files = e.target.files;
    setProfileImage(files[0]);
  };

  /**
   * To handle the cover image change
   * @param {e} event
   */
  const handleCoverImageChange = async (e) => {
    const files = e?.target?.files;
    setCoverImage(files[0]);
  };

  /**
   * To handle the profile image upload api
   * @param {e} function
   */
  const uploadProfileImage = async () => {
    try {
      const formData = new FormData();
      formData.append("files", profileImage);
      const imageUrl = await imageUpload(formData).unwrap();
      if (imageUrl?.data?.length) {
        return imageUrl?.data?.[0];
      } else {
        console.log("Profile Image upload failed");
        toaster("info");
      }
    } catch (err) {
      console.error("Failed to upload profile image", err);
      toaster("error", "Something went wrong while uploading profile image");
    }
  };

  /**
   * To handle the cover image upload api
   * @param {e} function
   */
  const uploadCoverImage = async () => {
    try {
      const formData = new FormData();
      formData.append("files", coverImage);
      const imageUrl = await imageUpload(formData).unwrap();
      if (imageUrl?.data?.length) {
        return imageUrl?.data?.[0];
      } else {
        console.log("cover image upload failed");
      }
    } catch (err) {
      console.error("Failed to upload cover image", err);
      toaster("error", "Something went wrong while uploading cover image");
    }
  };

  /**
   * To handle the function call profileImage, coverImage and user changes handle api
   * @param {e} function
   */
  const handleDataChange = async () => {
    const payload = {};
    if (profileImage) {
      payload.profileImage = await uploadProfileImage();
    }
    if (coverImage) {
      payload.coverImage = await uploadCoverImage();
    }
    if (name !== userDtls?.username) {
      payload.username = name;
    }
    if (Object.keys(payload).length > 0) {
      try {
        const resp = await updateUserInfo({
          userId: userDtls?.userId,
          toBeUpdated: payload,
        });
        if (resp?.data) {
          dispatch(setUserDetails({ ...resp.data, isLoggedIn: true }));
        }
        setCoverImage(null);
        setProfileImage(null);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      console.log("No changes....");
    }
    setOpenEditDialog(false);
  };

  const imgList = [
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  ];
  /**
   * Image List view
   * @returns jsx elements
   */
  const getSliderPreview = (value) => {
    if (value < 2) {
      return 2;
    } else if (value > 4) {
      return 4;
    } else {
      return value || 2;
    }
  };

  // Style Image List view for mobile
  const isMobile = useMediaQuery("(max-width:768px)");
  const slidesPerView = isMobile ? 1 : getSliderPreview(imgList?.length);

  // styled component for input field
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

  /**
   * Image list view component
   * @returns jsx elements
   * */
  const ImageListView = () => {
    return (
      <Box
        width={"100%"}
        sx={{ overflow: "auto", "&::-webkit-scrollbar": { display: "none" } }}
        display={"flex"}
      >
        <Swiper
          className="c-offers-scroll"
          modules={[Virtual, Navigation, HashNavigation]}
          spaceBetween={4}
          navigation={true}
          slidesPerView={slidesPerView}
          virtual
          hashNavigation={true}
        >
          {imgList?.map((ele, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              <img
                src={ele}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                className="c-offers-scroll"
                alt="loading"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };

  /**
   * component for account setting
   * @returns jsx elements
   */
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#f3f4f6",
        p: 2,
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 2000,
          borderRadius: "12px",
          overflow: "auto",
          height: "90dvh",
        }}
      >
        {/* Profile Header */}
        <Box sx={{ position: "relative", bgcolor: "#fff" }}>
          <IconButton
            onClick={() => navigate("/settings")}
            sx={{
              position: "absolute",
              color: "#fff",
              left: "1%",
              top: "4%",
              width: "30px",
              height: "30px",
              backgroundColor: "#65558fad",
              borderRadius: "50%",
            }}
          >
            <ArrowBackIcon fontSize="small"/>
          </IconButton>

          <img
            src={userDtls?.coverImage || download}
            alt="cover"
            style={{ width: "100%", height: 150, objectFit: "cover" }}
          />

          <IconButton
            onClick={() => setOpenEditDialog(true)}
            sx={{
              position: "absolute",
              color: "#fff",
              right: "1%",
              top: "4%",
              width: "30px",
              height: "30px",
              backgroundColor: "#65558fad",
              borderRadius: "50%",
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              position: "absolute",
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
              border: "4px solid white",
            }}
            src={userDtls?.profileImage}
            alt={name}
          />
        </Box>

        {/* Profile Info */}
        <Stack
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{ mt: 5, mb: 2, px: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {name}
          </Typography>
        </Stack>

        {/* Tags Section */}
        {/* <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" sx={{ mb: 1 }} />
            ))}
          </Stack>
        </Box> */}

        {/* Location Section */}
        <Box sx={{ px: 1, py: 1 }} className="location-icon">
          <TextField
            disabled={location}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Location"
            value={location?.locationName}
            InputProps={{
              startAdornment: <LocationOnIcon sx={{ color: "gray", mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f3f3f3",
              },
            }}
          />
        </Box>

        {/* Linked Highlights Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FlashOnIcon sx={{ mr: 1, color: "primary.main" }} />
              Linked Highlights
            </Typography>
            <Button
              size="small"
              endIcon={<MoreHorizIcon />}
              sx={{ textTransform: "none" }}
            >
              More
            </Button>
          </Stack>
          {/* Highlights Content */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              px: 1,
            }}
          >
            {/* Placeholder items for linked highlights */}
            <ImageListView />
          </Box>
          {userDtls?.type === "influencer" && (
            <>
              <Box sx={{ mx: "auto", mt: 2 }} className="accountalignment">
                {/* <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <FacebookIcon
                  fontSize="large"
                  sx={{ color: "#3b5998", mr: 2 }}
                />
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Typography variant="body1">@john doe</Typography>
                  <Typography variant="body2" color="textSecondary">
                    42K followers
                  </Typography>
                </Box>
              </CardContent>
            </Card> */}
                <Card variant="outlined" className="insta-account">
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <InstagramIcon
                      fontSize="large"
                      sx={{ color: "#E4405F", mr: 2 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Typography variant="body1">{`@${instagramData?.username}`}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {`${instagramData?.followers_count}`}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              <Stack className="bio-basics">
                <Box
                  component="form"
                  sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="standard-basic"
                    label="Favorite brands"
                    variant="standard"
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
                    label="Mini Bio"
                    variant="standard"
                  />
                </Box>
              </Stack>
            </>
          )}
        </Box>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1">Cover Image</Typography>
            {coverImage && (
              <Box height={100}>
                <img
                  style={{
                    display: "block",
                    height: "100%",
                    margin: "auto",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  src={URL.createObjectURL(coverImage)}
                  alt="loading"
                ></img>
              </Box>
            )}
            <Button
              sx={{ textTransform: "capitalize" }}
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddOutlinedIcon />}
            >
              Add image
              <VisuallyHiddenInput
                type="file"
                accept=".jpg, .jpeg, .png,.webp"
                onChange={(e) => handleCoverImageChange(e)}
                multiple
              />
            </Button>

            <Typography variant="subtitle1">Profile Image</Typography>
            {profileImage && (
              <Box
                justifyContent={"center"}
                display={"flex"}
                alignItems={"center"}
              >
                <Box height={100} width={100}>
                  <img
                    style={{
                      display: "block",
                      height: "100%",
                      margin: "auto",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    src={URL.createObjectURL(profileImage)}
                    alt="loading"
                  />
                </Box>
              </Box>
            )}
            <Button
              sx={{ textTransform: "capitalize" }}
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddOutlinedIcon />}
            >
              Set Profile Image
              <VisuallyHiddenInput
                type="file"
                accept=".jpg, .jpeg, .png,.webp"
                onChange={(e) => handleProfileImageChange(e)}
                multiple
              />
            </Button>

            <Typography variant="subtitle1">Name</Typography>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Typography variant="subtitle1">Location</Typography>

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
            {/* <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <FacebookIcon fontSize="large" sx={{ color: "#3b5998", mr: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography variant="body1">@john doe</Typography>
                <Typography variant="body2" color="textSecondary">
                  42K followers
                </Typography>
              </Box>
            </CardContent> */}
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <InstagramIcon
                fontSize="large"
                sx={{ color: "#E4405F", mr: 2 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography variant="body1">{`@${instagramData?.username}`}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {`${instagramData?.followers_count} Followers`}
                </Typography>
              </Box>
            </CardContent>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDataChange}
            disabled={
              !coverImage &&
              !profileImage &&
              userDtls?.username == name &&
              !location?.locationName?.length > 0
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
