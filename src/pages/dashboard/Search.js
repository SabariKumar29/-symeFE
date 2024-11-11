import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { meAtom } from "../../atoms/meAtom";
import { api } from "../../api/api";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import NoImage from "../../resources/no-image.png";

const columns = [
  { id: "profileImage", label: "Profile Picture", minWidth: 170 },
  { id: "username", label: "Name", minWidth: 170 },
  { id: "type", label: "Type", minWidth: 100 },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

const Search = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [user, setUser] = useRecoilState(meAtom);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const data = await api.post("barracks/user/search", {
        query: { type: "influencer" },
      });
      setRows(data);
      console.log(data);
      return data;
    };

    const fetchBusinesses = async () => {
      const data = await api.post("barracks/user/search", {
        query: { type: "business" },
      });
      setRows(data);
      return data;
    };

    if (user.type === "business") {
      fetchInfluencers();
    } else {
      fetchBusinesses();
    }
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
                          ) : column.id === "profileImage" ? (
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

export default Search;
