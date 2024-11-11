import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, HashNavigation } from "swiper/modules";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "swiper/css"; // Basic Swiper styles
import "swiper/css/virtual";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { downloadFunction } from "../../utils/common";

const Preview = ({ url, open, close, type }) => {
  const handlerDownload = async (url) => {
    downloadFunction(url, "image");
  };
  const previewFileOrImage = () => {
    switch (type) {
      case "image":
        return (
          <Box
            width={"100%"}
            sx={{
              overflow: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            className="img-view-ctn previewCtn"
          >
            <Swiper
              className="c-offers-scroll"
              modules={[Virtual, Navigation, HashNavigation]}
              spaceBetween={4}
              navigation={true}
              slidesPerView={1}
              virtual
              hashNavigation={true}
            >
              {/* {offerDtls?.offerImages?.map((ele, index) => (
                <SwiperSlide key={`offer-image-${index}`} virtualIndex={index}>
                  <img
                    src={
                      typeof ele === "string" ? ele : URL.createObjectURL(ele)
                    }
                    alt={`Offer-${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />
                </SwiperSlide> */}
              {Array.isArray(url) ? (
                url?.map((ele, index) => {
                  return (
                    <>
                      <SwiperSlide
                        key={`offer-image-${index}`}
                        virtualIndex={index}
                        // className="previewCtn"
                      >
                        <Box
                          role="button"
                          // position={"absolute"}
                          top={0}
                          zIndex={999999999}
                          display={"flex"}
                          // width={"100%"}
                          justifyContent={"space-between"}
                          sx={{
                            opacity: "0.4",
                            borderRadius: "15px",
                            padding: "5px",
                            cursor: "pointer",
                          }}
                        >
                          <CloseIcon onClick={() => close(false)} />
                          <FileDownloadOutlinedIcon
                            onClick={() => handlerDownload(ele)}
                          />
                        </Box>
                        <img
                          src={ele}
                          alt="preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        ></img>
                      </SwiperSlide>
                    </>
                  );
                })
              ) : (
                <img
                  src={url}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                ></img>
              )}
            </Swiper>
          </Box>
        );
      default:
        return <>test</>;
    }
  };

  return (
    <Dialog
      className="test"
      maxWidth={"lg"}
      height={"700px"}
      position={"relative"}
      onClose={close}
      open={open}
    >
      <Box>{previewFileOrImage()}</Box>
    </Dialog>
  );
};
export default Preview;
