import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import MyButton from "../MyButton";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import CarouselView from "../Influencer/Offers/Carousel";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ListIcon from "@mui/icons-material/List";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/Bookmark";
import { useEffect, useRef, useState } from "react";
import CompanyOffersRequest from "../Company/Offers/CompanyOffersRequest";
import toaster from "../Toaster/toaster";
import {
  useGetOfferByIdMutation,
  useSaveOfferMutation,
} from "../../services/apiService/userApiService";
import { useSelector } from "react-redux";
import useLoading from "../../hooks/useLoading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, HashNavigation } from "swiper/modules";
import "swiper/css"; // Basic Swiper styles
import "swiper/css/virtual";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useMediaQuery } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationAutoComplete from "../LocationAutoComplete/LocationAutoComplete";

// import "./CompanyOffers.css";

const OfferDetails = (props) => {
  const { offerId, data, isInfluencerView, handlerUpdateBookingStatus } = props;
  const { userDtls } = useSelector((state) => state?.auth);
  const [saveOffer] = useSaveOfferMutation();
  const [getOfferById] = useGetOfferByIdMutation();
  const { startLoading, stopLoading } = useLoading();
  const [offerDtls, setOfferDtls] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [index, setIndex] = useState(0);
  console.log("test>>>>>>", props);
  const [selectedTab, setSelectedTab] = useState("content");
  // if (!offerDtls) {
  //   // sample data
  //   offerDtls = {
  //     categories: ["Activities", "Nightlife", "self care", "Entertainment"],
  //     description:
  //       " Experience the ultimate relaxation with our exclusive influencer bundle! Enjoy a luxurious 2-night stay in our elegant hotel, complete with access to our serene spa and rejuvenating massage services. Delight in gourmet dining with two delicious meals per person, perfect for you and your guest. Embrace this unique opportunity to unwind and indulge, while sharing your memorable moments with your followers.",
  //     imgList: [
  //       "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  //       "https://s3-alpha-sig.figma.com/img/d4ea/c504/9ca670b24ead9225b4fa0092e8bfdea6?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GgHW9O4u8ZwghFDuB2H6SmhV8QMm2IbtdIAH3tGCiE-E-4blXNBSSS2VjeTFIN8sXnqIopGM0mFFCwZiw44Yr2lvIaxUBsmO~23VloT66dp1Z2a5vtdGz9eckb9fggHoxlEQeylAJd8a1yUfMvRtQ-3kU-kQVVoaz0UwORD8GckjrPEFeEXx4~3hCQrcA2PhC6fjuc3dEds1zBZdW3xhaCQTb35qToCfp16BO0J7I2RPE~bJvI1ylfB4MmGe5ZfsB0Ada4BMrMIf13OsAaQg8TZAvEoe~IfFn4V5J8hxClrrAagWiK21ZyH8YETutnzUJ6uyFDRa2SiaVwfrTMUMcA__",
  //       "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  //       "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  //       "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  //     ],
  //   };
  // }
  const containerRef = useRef(null);
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        const scrollAmount = e.deltaY > 0 ? 1 : -1;
        setIndex(
          (prevIndex) =>
            (prevIndex + scrollAmount + offerDtls?.offerImages?.length) %
            offerDtls?.offerImages?.length
        );
      }
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);
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
      } else {
        setOfferDtls([]);
      }
    } catch (err) {
      // setIsCardSelected(false);
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
   * To handle the save offer function
   * @param {event}
   */
  const handlerSaveOffer = async (e) => {
    try {
      e?.stopPropagation();
      e?.preventDefault();
      const payload = {
        offer_id: offerDtls?._id,
        // newStatus: "offeredToInfluencer",
        user_id: userDtls?.userId,
      };
      const response = await saveOffer(payload).unwrap();
      if (response?.success) {
        fetchOfferById(offerDtls?._id);
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
   * To handle the tab selection
   * @param (tabName)
   * @returns null
   */
  const handleOffersCardTab = (event, tabName) => {
    setSelectedTab(tabName);
  };

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

  const isMobile = useMediaQuery("(max-width:768px)");
  const slidesPerView = isMobile
    ? 1
    : getSliderPreview(offerDtls?.offerImages?.length);

  const ImageListView = () => {
    return (
      <Box
        width={"100%"}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        display={"flex"}
        className="img-view-ctn"
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
          {offerDtls?.offerImages?.map((ele, index) => (
            <SwiperSlide key={`offer-image-${index}`} virtualIndex={index}>
              <img
                src={typeof ele === "string" ? ele : URL.createObjectURL(ele)}
                alt={`Offer-${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <CarouselView
            imageList={offerDtls?.offerImages}
            className="c-offers-Slider"
          ></CarouselView> */}
        {/* <CarouselView
          imageList={offerDtls?.offerImages}
          className="c-offers-Slider"
        ></CarouselView> */}
      </Box>
    );
  };

  useEffect(() => {
    if (offerId) {
      fetchOfferById(offerId);
    } else {
      setOfferDtls(data);
    }
  }, [offerId, data]);
  return (
    <Box
      margin={1}
      // sx={{ overflow: "hidden auto" }}
      //   className="c-offers-content"
    >
      {showMap ? (
        <LocationAutoComplete
          lat={offerDtls?.location?.coordinates?.latitude}
          lng={offerDtls?.location?.coordinates?.longitude}
          showMapOnly={true}
        />
      ) : (
        <>
          <ImageListView />
        </>
      )}

      <Stack direction={"row"} mt={1} gap={1} alignItems={"center"}>
        <Box
          onClick={() => setShowMap(!showMap)}
          display={"flex"}
          width={187}
          height={44}
          boxShadow={3}
          borderRadius={"54px"}
        >
          <MyButton
            color="secondary"
            height={"32px"}
            sx={{
              color: "primary2.main",
              borderRadius: "54px",
              margin: "6px",
              width: "auto",
            }}
            startIcon={
              <LocationOnOutlinedIcon sx={{ color: "primary2.main" }} />
            }
          >
            {!showMap && " Map"}
          </MyButton>
          <Button
            title={offerDtls?.location?.locationName}
            sx={{
              textTransform: "capitalize",
              textWrap: "nowrap",
              width: "82px",
              height: "32px",
              marginTop: "6px",
              padding: "6px 2px",
            }}
            className="textEllipsis"
          >
            <Typography
              className="textEllipsis"
              width={"82px"}
              fontSize={"12px"}
              color={"gray.main"}
              fontWeight=" 500"
            >
              {showMap ? offerDtls?.location?.locationName : "Copenhagen"}
            </Typography>
          </Button>
        </Box>
        {userDtls?.type === "influencer" && (
          <IconButton
            sx={{ border: "none", height: "32px" }}
            color="primary"
            onClick={(e) => handlerSaveOffer(e)}
          >
            {offerDtls?.isOfferSaved ? <TurnedInIcon /> : <TurnedInNotIcon />}
          </IconButton>
        )}
      </Stack>
      {isInfluencerView ? (
        <>
          <TabContext
            value={selectedTab}
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
              className="c-offers-content"
              sx={{ width: "100%", padding: "5px" }}
              value="content"
            >
              <Box>
                <Typography fontWeight={700} variant={"h5"}>
                  {"Description"}
                </Typography>
                {/* <Divider />  */}
                <Typography marginLeft={3}>{offerDtls?.description}</Typography>
                <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
                  {offerDtls?.categories?.map((ele) => {
                    return (
                      <MyButton
                        color="secondary"
                        sx={{
                          height: "32px",
                          color: "primary",
                          marginTop: 2,
                          padding: 1,
                          borderRadius: 7,
                          fontWeight: 700,
                        }}
                        startIcon={<CheckCircleRoundedIcon />}
                      >
                        {ele?.value}
                      </MyButton>
                    );
                  })}
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel
              sx={{
                width: "100%",
                // height: "calc(100vh - 132px)",
                // overflow: "hidden auto",
              }}
              value="request"
            >
              <CompanyOffersRequest
                data={offerDtls}
                handlerUpdateBookingStatus={handlerUpdateBookingStatus}
              />
            </TabPanel>
          </TabContext>
        </>
      ) : (
        <>
          <Box>
            <Typography
              mt={1}
              fontWeight={700}
              // variant={"body1"}
              // fontSize={"1.2rem"}
              sx={{ fontSize: "1.2rem" }}
            >
              {"Description"}
            </Typography>
            {/* <Divider />  */}
            <Typography marginLeft={3}>{offerDtls?.description}</Typography>
            <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
              {offerDtls?.categories?.map((ele) => {
                return (
                  <MyButton
                    color="secondary"
                    sx={{
                      height: "32px",
                      color: "primary",
                      marginTop: 2,
                      padding: 1,
                      borderRadius: 7,
                      fontWeight: 700,
                    }}
                    startIcon={<CheckCircleRoundedIcon />}
                  >
                    {ele?.value}
                  </MyButton>
                );
              })}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};
export default OfferDetails;
