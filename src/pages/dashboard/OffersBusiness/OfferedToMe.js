import React, { useState, useEffect } from "react";
import { api } from "../../../api/api";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import NoImage from "../../../resources/no-image.png";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const columns = [
  { id: "offerImageUrl", label: "Offer Picture", minWidth: 170 },
  { id: "title", label: "Title", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 100 },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});
const OfferedToMe = (props) => {
  const classes = useStyles();
  const user = props.user;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchOffersForTheUser = async (user) => {
      if (user.type === "business") {
        const data = await api.post("dealer/offer/fetchAllOffersForBusiness", {
          userId: user.userId,
        });
        setRows(data);
        return data;
      } else {
        const data = await api.post(
          "dealer/offer/fetchAllOffersForInfluencer",
          {
            userId: user.userId,
          }
        );
        console.log(data);
        setRows(data);
        return data;
      }
    };

    fetchOffersForTheUser(user);
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : column.id === "offerImageUrl" ? (
                            <Box
                              component="img"
                              sx={{
                                height: 100,
                                width: 100,
                                maxHeight: { xs: 100, md: 70 },
                                maxWidth: { xs: 100, md: 70 },
                                objectFit: "cover",
                              }}
                              alt="profileImage"
                              src={value ? value : NoImage}
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OfferedToMe;
