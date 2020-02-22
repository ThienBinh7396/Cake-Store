import React from "react";
import {
  TableCell,
  withStyles,
  TableRow,
  LinearProgress,
  Typography,
  Box,
  Select,
  MenuItem,
  IconButton
} from "@material-ui/core";
import BaseIcon from "./BaseIcon";

export const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#fff",
    color: "#3f6ad8",
    fontWeight: "bold",
    padding: "10px 16px"
  },
  body: {
    fontSize: 15,
    padding: "10px 16px"
  }
}))(TableCell);

export const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd):not(:last-child)": {
      backgroundColor: theme.palette.background.default
    },
    "&.active": {
      backgroundColor: "#275adac2 !important"
    },
    "&.active .MuiTableCell-body": {
      color: "#fff"
    },
    "&:hover:not(:last-child)": {
      backgroundColor: "#2524241a"
    },
    "&:last-child": {
      "& td": {
        border: "none"
      }
    }
  }
}))(TableRow);

export const StyledTableHelperRow = props => (
  <TableRow>
    <TableCell className="table-loading" colSpan={props.columns}>
      {props.loading && <LinearProgress className="table-loading-progress" />}
      <Typography align={"center"} className="text-blur">
        {props.type === "loading"
          ? "Loading...Please wait."
          : "No records found..."}
      </Typography>
      <div>{props.loading}</div>
    </TableCell>
  </TableRow>
);

export const StyledTablePagination = ({
  colSpan,
  data,
  page,
  setPage,
  pageLength,
  setPageLength
}) => {
  const pageLengths = [5, 10, 25];
  return (
    <StyledTableRow>
      <Box
        component="td"
        colSpan={colSpan}
        className={"table-pagination-wrapper"}
      >
        <Box className={"table-pagination"}>
          <Box
            className="table-pagination-pageLength"
            display="flex"
            alignItems="center"
          >
            <Box mr={2}>Rows per page</Box>
            <Select
              value={pageLength}
              onChange={e => {
                setPageLength(e.target.value);
              }}
              displayEmpty
            >
              {data && <MenuItem value={data.length}>All</MenuItem>}
              {pageLengths.map((it, index) => (
                <MenuItem key={`#pageLength-${index}`} value={it}>
                  {it}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className="table-pagination-content">
            {page * pageLength + 1}-
            {data && (page + 1) * pageLength > data.length
              ? data.length
              : (page + 1) * pageLength}{" "}
            of {data ? data.length : 0}
          </Box>
          <Box className={"table-pagination-control"}>
            <IconButton
              disabled={!(data && data.length > pageLength && page !== 0)}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <BaseIcon icon="fas fa-chevron-left"></BaseIcon>
            </IconButton>
            <IconButton
              disabled={
                !(
                  data &&
                  Math.ceil(data.length / pageLength) >= 2 &&
                  page < Math.ceil(data.length / pageLength) - 1
                )
              }
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <BaseIcon icon="fas fa-chevron-right"></BaseIcon>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </StyledTableRow>
  );
};
