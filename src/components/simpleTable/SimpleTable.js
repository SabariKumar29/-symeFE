import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import { Box, Typography } from "@mui/material";
const SimpleTable = ({ columns, tableData }) => {
  console.log(columns);

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead: React.forwardRef((props, ref) => (
      <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };
  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? "right" : "left"}
            style={{ width: column.width }}
            sx={{ backgroundColor: "#66578d" }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  function rowContent(_index, tableData) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <>
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? "right" : "left"}
            >
              {typeof column?.cell === "function"
                ? column?.cell(tableData)
                : tableData[column.dataKey]}
            </TableCell>
          </>
        ))}
      </React.Fragment>
    );
  }
  return (
    <Paper style={{ height: "100%", width: "100%" }}>
      {tableData?.length > 0 ? (
        <TableVirtuoso
          data={tableData}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
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
    </Paper>
  );
};
export default SimpleTable;
