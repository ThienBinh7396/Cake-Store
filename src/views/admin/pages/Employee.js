import React, { useEffect, useState, useRef, useContext } from "react";
import * as Helper from  "../../../utils/helper";
import { useSnackbar } from "notistack";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  withStyles,
  Paper,
  TableBody,
  Typography,
  LinearProgress,
  FormControl,
  MenuItem,
  Select,
  makeStyles,
  FormControlLabel,
  Box,
  IconButton
} from "@material-ui/core";
import BaseSwitch from "../../../common/component/BaseSwitch";
import { withRouter } from "react-router-dom";
import BaseIcon from "../../../common/component/BaseIcon";
import { AdminContext } from "../context/AdminProvider";

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
    "&:last-child": {
      "& td": {
        border: "none"
      }
    }
  }
}))(TableRow);

const _columns = [
  {
    title: "No.",
    field: "no"
  },
  {
    title: "Email",
    field: "email"
  },
  {
    title: "Role",
    field: "role"
  },
  {
    title: "Active",
    field: "active"
  },
  {
    title: "Time",
    field: "createdAt"
  }
];

function Employee(props) {

  const { enqueueSnackbar } = useSnackbar();
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
    document.title = "Admin - Employee";
  }, [props.history]);

 

  const showToast = (message, variant = "default") => {
    enqueueSnackbar(message, { variant });
  };

  const admin = useContext(AdminContext);
  const _admin = useRef(admin);

  const axios = admin.axios.data;

  useEffect(() => {
    console.log("admin", _admin);

    let { employees, loadingComponent } = _admin.current;
    if (!employees.data) {
      employees.fetchEmployee();
      loadingComponent.updateState(true);
    }
  }, []);

  let _employees = admin.employees;

  let _progressDialog = admin.progressDialog;

  const handleChange = (target, prop, newVal) => {
    let oldVal = target[prop];
    target[prop] = newVal;

    _progressDialog.updateState(true, "Updating...");

    axios
      .post("admin/employees/updateByAdmin", {
        id: target.id,
        role: target.role,
        active: target.active
      })
      .then(rs => {
        _progressDialog.updateState(false, "Updating...");

        let { type, message } = rs.data;

        showToast(message, type);
        if (type !== "success") {
          target[prop] = oldVal;

          _employees.updateData(target);
        }
      })
      .catch(err => {
        console.log(err);
        _progressDialog.updateState(false, "Updating...");
        showToast("Update failed!", "error");
      });
  };

  const [page, setPage] = useState(0);
  const pageLength = 10;

  useEffect(() => {
    setPage(0);
  }, [_employees.data]);

  return (
    <Box style={{ padding: "16px 8px" }}>
      <TableContainer className={classes.tableWrapper} component={Paper}>
        <Table className="table-data">
          <TableHead>
            <StyledTableRow>
              {_columns.map(it => (
                <StyledTableCell key={it.title}>{it.title}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {_employees.loading ? (
              <TableRow>
                <TableCell className="table-loading" colSpan={_columns.length}>
                  <LinearProgress className="table-loading-progress" />
                  <Typography align={"center"} className="text-blur">
                    Loading...Please wait.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              _employees.data &&
              _employees.data.map((it, index) => (
                <StyledTableRow key={`employee_${it.id}`}>
                  <StyledTableCell>
                    <strong>{index + 1}</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>{it.email}</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControl className={classes.baseSelect}>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={it.role}
                        onChange={event =>
                          handleChange(it, "role", event.target.value)
                        }
                      >
                        <MenuItem value={2}>Product Manager</MenuItem>
                        <MenuItem value={3}>Order Manager</MenuItem>
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControlLabel
                      control={
                        <BaseSwitch
                          checked={it.active}
                          onChange={e => {
                            handleChange(it, "active", e.target.checked);
                          }}
                        />
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {Helper.formatDate(it.createdAt, 3).format}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
            <StyledTableRow>
              <Box
                component="td"
                colSpan={_columns.length}
                className={"table-pagination-wrapper"}
              >
                <Box className={"table-pagination"}>
                  <Box className="table-pagination-content">
                    {page * pageLength}-
                    {_employees.data &&
                    (page + 1) * pageLength > _employees.data.length
                      ? _employees.data.length
                      : (page + 1) * pageLength}{" "}
                    of {_employees.data ? _employees.data.length : 0}
                  </Box>
                  <Box className={"table-pagination-control"}>
                    <IconButton
                      disabled={
                        !(
                          _employees.data &&
                          _employees.data.length > pageLength &&
                          page !== 0
                        )
                      }
                    >
                      <BaseIcon icon="fas fa-chevron-left"></BaseIcon>
                    </IconButton>
                    <IconButton
                      disabled={
                        !(
                          Math.ceil(
                            _employees.data &&
                              _employees.data.length / pageLength
                          ) > 2 &&
                          page <
                            Math.ceil(
                              _employees.data &&
                                _employees.data.length / pageLength
                            ) -
                              1
                        )
                      }
                    >
                      <BaseIcon icon="fas fa-chevron-right"></BaseIcon>
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


export default withRouter(Employee);
