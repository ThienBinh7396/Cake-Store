import React, { useEffect, useRef, useContext, useState } from "react";
import {
  Box,
  TableCell,
  TableRow,
  withStyles,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper,
  LinearProgress,
  Typography,
  CardMedia,
  IconButton,
  ButtonBase,
  Button
} from "@material-ui/core";

import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { AdminContext } from "../context/AdminProvider";
import BaseIcon from "../../../common/component/BaseIcon";

import { CSSTransition } from "react-transition-group";
import { withRouter } from "react-router-dom";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#fff",
    color: "#3f6ad8",
    fontWeight: "bold",
    padding: "10px 16px"
  },
  body: {
    fontSize: 15,
    padding: "8px 16px"
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "&:hover": {
      backgroundColor: "#2524241a"
    },
    "&:last-child": {
      "& td": {
        border: "none"
      }
    }
  }
}))(TableRow);

function TablePagination({ _columns, _products, page, setPage, pageLength }) {
  return (
    <StyledTableRow>
      <Box
        component="td"
        colSpan={_columns.length}
        className={"table-pagination-wrapper"}
      >
        <Box className={"table-pagination"}>
          <Box className="table-pagination-content">
            {page * pageLength + 1}-
            {_products.data && (page + 1) * pageLength > _products.data.length
              ? _products.data.length
              : (page + 1) * pageLength}{" "}
            of {_products.data ? _products.data.length : 0}
          </Box>
          <Box className={"table-pagination-control"}>
            <IconButton
              disabled={
                !(
                  _products.data &&
                  _products.data.length > pageLength &&
                  page !== 0
                )
              }
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <BaseIcon icon="fas fa-chevron-left"></BaseIcon>
            </IconButton>
            <IconButton
              disabled={
                !(
                  _products.data &&
                  Math.ceil(_products.data.length / pageLength) >= 2 &&
                  page < Math.ceil(_products.data.length / pageLength) - 1
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
}

function Cakes(props) {
  const _columns = [
    {
      title: "No.",
      field: "index"
    },
    {
      title: "Title",
      field: "title"
    },
    {
      title: "Thumbnail",
      field: "thumbnail"
    },
    {
      title: "Price($)",
      field: "price"
    },
    {
      title: "Discount",
      field: "discount"
    },
    {
      title: "Status",
      field: "status"
    },
    {
      title: "Action",
      field: "action"
    }
  ];

  const statusColor = {
    available: "#48ce4e",
    busy: "#FB9514",
    unavailable: "#ff0101"
  };

  const useStyles = makeStyles(theme => ({
    tableWrapper: {
      padding: "12px 16px",
      boxShadow:
        "0 0.46875rem 2.1875rem rgba(8,10,37,.03), 0 0.9375rem 1.40625rem rgba(8,10,37,.03), 0 0.25rem 0.53125rem rgba(8,10,37,.05), 0 0.125rem 0.1875rem rgba(8,10,37,.03)",
      transition: ".2s"
    },
    baseSelect: {
      "& .MuiSelect-select.MuiSelect-select": {
        borderRadius: "4px",
        backgroundColor: "#487afb",
        color: "#fff",
        padding: "8px 28px 8px 11px",
        fontSize: "14px",
        boxShadow:
          "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)"
      },
      "& .MuiSelect-icon": {
        color: "#fff"
      },
      "& .MuiInput-underline:before": {
        border: "none"
      },
      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        border: "none"
      }
    }
  }));

  const classes = useStyles();

  useEffect(() => {
    document.title = "Admin - Cakes";
  }, [props.history]);

  const { enqueueSnackbar } = useSnackbar();

  const showToast = (message, variant = "default") => {
    enqueueSnackbar(message, { variant });
  };

  const admin = useContext(AdminContext);
  const _admin = useRef(admin);

  let _products = admin.products;

  useEffect(() => {
    console.log("admin", _admin);

    let { products, loadingComponent } = _admin.current;
    if (!products.data) {
      products.fetchProduct();
      loadingComponent.updateState(true);
    }
  }, []);

  const [page, setPage] = useState(0);
  const pageLength = 5;

  useEffect(() => {
    setPage(0);
  }, [_products.data]);

  const checkInRange = index => {
    console.log(index);
    return page * pageLength <= index && (page + 1) * pageLength > index;
  };

  return (
    <Box style={{ padding: "20px 8px" }}>
      <TableContainer className={classes.tableWrapper} component={Paper}>
        <Button
          style={{
            marginBottom: "18px",
            display: "flex",
            alignItems: "center"
          }}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(props);
            props.history.push(
              `/admin/cake/add`
            );
          }}
        >
          <BaseIcon icon="fas fa-plus" color="#fff" />
          &nbsp;Create
        </Button>
        <Table className="table-data">
          <TableHead>
            <StyledTableRow>
              {_columns.map(it => (
                <StyledTableCell key={it.title}>{it.title}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {_products.loading ? (
              <TableRow>
                <TableCell className="table-loading" colSpan={_columns.length}>
                  <LinearProgress className="table-loading-progress" />
                  <Typography align={"center"} className="text-blur">
                    Loading...Please wait.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              _products.data &&
              _products.data.map((it, index) => (
                <CSSTransition
                  key={it.id}
                  timeout={300}
                  classNames="transition-zoom"
                >
                  <StyledTableRow
                    style={{
                      display: checkInRange(index) ? "table-row" : "none"
                    }}
                  >
                    {_columns.map(_column => {
                      switch (_column.field) {
                        case "index":
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              <strong>{index + 1}</strong>
                            </StyledTableCell>
                          );
                        case "price":
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              <strong style={{ color: "#FF0101" }}>
                                {it[_column.field]
                                  .toFixed(2)
                                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                              </strong>
                            </StyledTableCell>
                          );
                        case "thumbnail":
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              <CardMedia
                                style={{ width: "80px" }}
                                component={"img"}
                                image={it[_column.field]}
                              ></CardMedia>
                            </StyledTableCell>
                          );
                        case "status":
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              <Box
                                className="base-chip small-size"
                                style={{
                                  backgroundColor: statusColor[it.status]
                                }}
                              >
                                {it[_column.field]}
                              </Box>
                            </StyledTableCell>
                          );
                        case "action":
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              <ButtonBase
                                className="button-icon round"
                                style={{
                                  background: "#48ce4e",
                                  marginRight: "4px"
                                }}
                                onClick={() => {
                                  console.log(props);
                                  props.history.push(
                                    `/admin/cake/edit/${it.id}`
                                  );
                                }}
                              >
                                <BaseIcon
                                  size="17"
                                  color="#fff"
                                  icon="fas fa-pen"
                                ></BaseIcon>
                              </ButtonBase>
                              <ButtonBase
                                className="button-icon round"
                                style={{ background: "#ff0101" }}
                              >
                                <BaseIcon
                                  size="17"
                                  color="#fff"
                                  icon="fas fa-trash"
                                ></BaseIcon>
                              </ButtonBase>
                            </StyledTableCell>
                          );

                        default:
                          return (
                            <StyledTableCell
                              key={`_product-${_column.field}-${index}`}
                            >
                              {it[_column.field]}
                            </StyledTableCell>
                          );
                      }
                    })}
                  </StyledTableRow>
                </CSSTransition>
              ))
            )}

            <TablePagination
              {...{ _columns, _products, page, setPage, pageLength }}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mapStateToProps = state => ({
  admin: state.admin
});

export default connect(mapStateToProps, {})(withRouter(Cakes));
