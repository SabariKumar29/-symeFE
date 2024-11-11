import { FixedSizeGrid as Grid } from "react-window";
import { useState, useEffect } from "react";
import PhotoView from "./PhotoView";

// Helper hook to get window dimensions
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const VirtualizedPhotoViewGrid = ({
  offersList,
  handleSelectOffersCard,
  handlerFetchOffers,
  handlerUpdateBookingStatus,
  filterCode,
}) => {
  // Get the current window dimensions
  const { width } = useWindowDimensions();

  // Define a minimum width for each PhotoView item
  const minItemWidth = 350; // Set this based on the ideal minimum size of the PhotoView card
  const columnCount = Math.max(1, Math.floor(width / minItemWidth)); // Calculate how many columns fit based on the screen width
  const columnWidth = Math.ceil(width / columnCount); // Divide the screen width by the number of columns

  // Height of each item, can be adjusted based on the design or remain a fixed value
  const rowHeight = columnWidth * 1.3; // Keeping a 3:2 ratio for width:height for each PhotoView card

  // Number of rows
  const rowCount = Math.ceil(offersList.length / columnCount);

  // Render function for each item in the grid
  const renderPhotoView = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const ele = offersList[index];

    if (!ele) return null;

    return (
      <div style={{ ...style, padding: "10px" }}>
        <PhotoView
          data={ele}
          handleSelectOffersCard={handleSelectOffersCard}
          handlerFetchOffers={handlerFetchOffers}
          handlerUpdateBookingStatus={handlerUpdateBookingStatus}
          isSavedOffer={filterCode === "saved" || ele?.isOfferSaved || false}
        />
      </div>
    );
  };

  return (
    <Grid
      columnCount={columnCount} // Dynamic based on screen size
      columnWidth={columnWidth} // Dynamic based on screen size
      height={800} // The overall height of the grid (you can adjust this)
      rowCount={rowCount} // Number of rows calculated from the number of items
      rowHeight={rowHeight} // Adjust height based on the width for a proper aspect ratio
      width={width} // Full width of the container
    >
      {renderPhotoView}
    </Grid>
  );
};

export default VirtualizedPhotoViewGrid;
