import { useEffect, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";

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

const VirtualScrollWrapper = ({ data, renderItem }) => {
  const { width } = useWindowDimensions();

  const minItemWidth = 350;
  const columnCount = Math.max(1, Math.floor(width / minItemWidth));
  const columnWidth = Math.ceil(width / columnCount);
  const rowHeight = columnWidth * 1.3;
  const rowCount = Math.ceil(data.length / columnCount);

  const renderCell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = data[index];

    if (!item) return null;

    return (
      <>
        {/* Check if renderItem is passed as a function */}
        {typeof renderItem === "function" ? renderItem(item, rowIndex) : null}
      </>
    );
  };

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={800}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={width}
    >
      {renderCell}
    </Grid>
  );
};

export default VirtualScrollWrapper;
