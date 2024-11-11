// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
// import image from "../../../assets/image/Media.png";
// import { Box } from "@mui/material";
// const CarouselView = ({
//   showDots = false,
//   className,
//   handleSelectOffersCard,
//   imageList,
// }) => {
//   return (
//     <div
//       // onClick={handleSelectOffersCard}
//       style={{
//         paddingBottom: "5px",
//         overflow: "hidden",
//         height: "100%",
//         width: "100%",
//         // position: "relative",
//         borderRadius: 1,
//         // maxWidth: "320px",
//       }}
//     >
//       <Carousel
//         // onClickItem={handleSelectOffersCard}
//         additionalTransfrom={0}
//         arrows
//         autoPlaySpeed={3000}
//         centerMode={false}
//         className={className}
//         containerClass="container"
//         dotListClass="card-tag"
//         draggable
//         focusOnSelect={false}
//         infinite
//         itemClass=""
//         keyBoardControl
//         minimumTouchDrag={80}
//         pauseOnHover
//         renderArrowsWhenDisabled={false}
//         renderButtonGroupOutside={false}
//         renderDotsOutside
//         showThumbs={false}
//         responsive={{
//           desktop: {
//             breakpoint: {
//               max: 3000,
//               min: 1024,
//             },
//             items: 1,
//           },
//           mobile: {
//             breakpoint: {
//               max: 464,
//               min: 0,
//             },
//             items: 1,
//           },
//           tablet: {
//             breakpoint: {
//               max: 1024,
//               min: 464,
//             },
//             items: 1,
//           },
//         }}
//         rewind={false}
//         rewindWithAnimation={false}
//         rtl={false}
//         shouldResetAutoplay
//         showDots={showDots}
//         sliderClass=""
//         slidesToSlide={1}
//         swipeable
//         onClickThumb={(e) => {
//           e.stopPropagation();
//           e.preventDefault();
//           console.log(e, "thumb");
//         }}
//       >
//         {imageList?.map((ele, index) => {
//           return (
//             // <img
//             //   key={index}
//             //   src={ele}
//             //   className="c-offers-scroll"
//             //   style={{
//             //     display: "block",
//             //     height: "100%",
//             //     margin: "auto",
//             //     width: "100%",
//             //     // height: 320,
//             //     // maxWidth: 320,
//             //     // borderRadius: 12,
//             //     objectFit: "cover",
//             //     objectPosition:"center"
//             //     // margin: 6,
//             //   }}
//             //   alt={`Carousel Image ${index}`}
//             // />
//             <Box
//               key={index}
//               component="img"
//               className="c-offers-scroll"
//               src={ele}
//               alt={`Carousel Image ${index}`}
//               sx={{
//                 display: "block",
//                 height: "100%",
//                 width: "100%",
//                 objectFit: "cover", // Ensures the image covers the container
//                 objectPosition: "center", // Ensures the image is centered
//               }}
//             />
//           );
//         })}
//       </Carousel>
//     </div>
//   );
// };
// export default CarouselView;
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Box from "@mui/material/Box";

const CarouselView = ({
  showDots = false,
  className,
  handleSelectOffersCard,
  imageList,
}) => {
  return (
    <Box
      // onClick={handleSelectOffersCard}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className={className}
        containerClass="container"
        dotListClass="card-tag"
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside
        showThumbs={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={showDots}
        sliderClass=""
        slidesToSlide={1}
        swipeable={true}
        onClickThumb={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log(e, "thumb");
        }}
      >
        {imageList?.map((ele, index) => (
          <Box
            key={index}
            component="img"
            // className="c-offers-scroll"
            src={ele}
            alt={`Carousel Image ${index}`}
            sx={{
              display: " flex",
              height: "320px",
              borderRadius: "12px",
              alignItems: "center",
              objectFit: "cover",
            }}
          />
        ))}
      </Carousel>
    </Box>
  );
};

export default CarouselView;
