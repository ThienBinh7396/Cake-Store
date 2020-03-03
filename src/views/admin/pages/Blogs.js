import React from "react";
import {
  Box,
  TableContainer,
  Button,
  Table,
  Paper,
  TableHead,
  withStyles,
  TableBody,
  ButtonBase,
  CardMedia
} from "@material-ui/core";
import BaseIcon from "../../../common/component/BaseIcon";
import { withRouter } from "react-router-dom";
import { AdminContext } from "./../context/AdminProvider";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTableHelperRow,
  StyledTablePagination
} from "../../../common/component/StyledTable";
import * as Helper from "../../../utils/helper";
import BaseDialog from "../../../common/component/BaseDialog";

import { withSnackbar } from "notistack";

const useStyles = theme => ({
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
});

class Blogs extends React.Component {
  static contextType = AdminContext;

  state = {
    dialog: false,
    blog: null,
    blogs: null,
    page: 0,
    pageLength: 5,
    columns: [
      {
        title: "No.",
        field: "no"
      },
      { title: "Title", field: "title" },
      { title: "Thumbnail", field: "thumbnail" },
      { title: "Status", field: "status" },
      { title: "Upload", field: "upload_id" },
      { title: "Time", field: "createdAt" },
      { title: "Actions", field: "action" }
    ],
    statusWithColor: [
      {
        value: 1,
        text: "Available",
        color: "#48ce4e"
      },
      {
        value: 0,
        text: "Awaiting approval",
        color: "#ff8e00"
      },
      {
        value: -1,
        text: "Unavailable",
        color: "#ff0101"
      }
    ]
  };

  componentDidMount() {
    let { blogs, loadingComponent, progressDialog } = this.context;

    this.progressDialog = progressDialog;

    this.showToast = (message, type = "default") => {
      this.props.enqueueSnackbar(message, { variant: type });
    };

    this.setState(
      {
        blogs
      },
      () => {
        if (this.state.blogs.data == null) {
          loadingComponent.updateState(true);
          this.state.blogs.fetchData();
        }
      }
    );
  }

  componentDidUpdate() {
    let { blogs } = this.context;

    if (
      this.state.blogs.data !== blogs.data ||
      this.state.blogs.loading !== blogs.loading
    ) {
      this.setState({
        blogs: {
          ...this.state.blogs,
          data: blogs.data,
          loading: blogs.loading
        }
      });
    }
  }

  deleteBlog = () => {
    if (!this.state.blog) return;

    console.log(this.props);

    this.progressDialog.updateState(true, "Deleting...");

    this.props.admin.axios
      .post("admin/blog/delete", {
        id: this.state.blog.id
      })
      .then(rs => {
        this.progressDialog.updateState(false, "Deleting...");
        let { type, message } = rs.data;

        this.showToast(message, type);

        if (type === "success") {
          this.state.blogs.updateData({
            type: "delete",
            blog: this.state.blog
          });
        }
      })
      .catch(err => {
        this.progressDialog.updateState(false, "Deleting...");
        this.showToast("Delete blog failed!");
      });
  };
  checkInRange = index => {
    return (
      this.state.page * this.state.pageLength <= index &&
      (this.state.page + 1) * this.state.pageLength > index
    );
  };

  renderRow = (it, index) => {
    return (
      <StyledTableRow
        key={`#row-${index}`}
        style={{
          display: this.checkInRange(index) ? "table-row" : "none"
        }}
        className={it.id === this.state.id ? "active" : ""}
      >
        {console.log(index)}
        {this.state.columns.map(_column => {
          switch (_column.field) {
            case "no":
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  <Box component="strong" style={{ color: "#2C4A97" }}>
                    {index + 1}
                  </Box>
                </StyledTableCell>
              );
            case "title": {
              return (
                <StyledTableCell key={`_product-${index}-${_column.field}`}>
                  <Box className="text-truncate" style={{ width: "120px" }}>
                    {it[_column.field]}
                  </Box>
                </StyledTableCell>
              );
            }
            case "thumbnail":
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  <CardMedia
                    component="img"
                    style={{ width: "80px" }}
                    image={it[_column.field]}
                  />
                </StyledTableCell>
              );
            case "status":
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  <Box
                    className="base-chip small-size"
                    style={{
                      backgroundColor: this.state.statusWithColor.find(
                        _status => _status.value === it.status
                      ).color
                    }}
                  >
                    {
                      this.state.statusWithColor.find(
                        _status => _status.value === it.status
                      ).text
                    }
                  </Box>
                </StyledTableCell>
              );
            case "upload_id":
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  <Box className="base-chip small-size"
                   style={{
                    backgroundColor: it.upload_id === -1 ? '#777' : '#3f6ad8'
                  }}>
                    {it.upload_id === -1 ? "Admin" : it.Customer.name}
                  </Box>
                </StyledTableCell>
              );
            case "createdAt":
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  {Helper.formatDate(it.createdAt, 3).format}
                </StyledTableCell>
              );
            case "action":
              return (
                <StyledTableCell key={`_product-${_column.field}-${index}`}>
                  <ButtonBase
                    className="button-icon round"
                    style={{
                      background: "#48ce4e",
                      marginRight: "4px"
                    }}
                    onClick={() => {
                      this.props.history.push(`/admin/blog/edit/${it.id}`);
                    }}
                  >
                    <BaseIcon
                      size="13"
                      color="#fff"
                      icon="fas fa-pen"
                    ></BaseIcon>
                  </ButtonBase>
                  <ButtonBase
                    className="button-icon round"
                    style={{ background: "#ff0101" }}
                    onClick={() => {
                      this.setState({
                        dialog: true,
                        blog: it
                      });
                    }}
                  >
                    <BaseIcon
                      size="13"
                      color="#fff"
                      icon="fas fa-trash"
                    ></BaseIcon>
                  </ButtonBase>
                </StyledTableCell>
              );
            default:
              return (
                <StyledTableCell key={`#cell-${index}-${_column.field}`}>
                  {it[_column.field]}
                </StyledTableCell>
              );
          }
        })}
      </StyledTableRow>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Box style={{ padding: "16px 8px" }}>
        <BaseDialog
          style={{ zIndex: 100 }}
          open={this.state.dialog}
          maxWidth="xs"
          fullWidth={true}
          title="Comfirm"
          type="text"
          onClose={() => {
            this.setState({ dialog: false });
          }}
          onSubmit={() => {
            this.deleteBlog();
            this.setState({ dialog: false });
          }}
        >
          <strong style={{ color: "#2f55b7" }}>Are you sure?</strong> You won't
          be able to revert this!
        </BaseDialog>

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
              this.props.history.push(`/admin/blog/add`);
            }}
          >
            <BaseIcon icon="fas fa-plus" color="#fff" />
            &nbsp;Create
          </Button>
          <Table className="table-data">
            <TableHead>
              <StyledTableRow>
                {this.state.columns.map(it => (
                  <StyledTableCell key={`#tb-head-${it.title}`}>
                    {it.title}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {this.state.blogs && this.state.blogs.loading && (
                <StyledTableHelperRow
                  loading={this.state.blogs.loading}
                  type="loading"
                  columns={this.state.columns.length}
                />
              )}
              {this.state.blogs &&
                !this.state.blogs.loading &&
                (!this.state.blogs.data ||
                  this.state.blogs.data.length === 0) && (
                  <StyledTableHelperRow
                    loading={this.state.blogs.loading}
                    type="no-data"
                    columns={this.state.columns.length}
                  />
                )}

              {this.state.blogs &&
                !this.state.blogs.loading &&
                this.state.blogs.data &&
                this.state.blogs.data.length !== 0 &&
                this.state.blogs.data.map((it, index) => {
                  return this.renderRow(it, index);
                })}

              {
                <StyledTablePagination
                  {...{
                    colSpan: this.state.columns.length,
                    data:
                      this.state.blogs && this.state.blogs.data
                        ? this.state.blogs.data
                        : [],
                    page: this.state.page,
                    setPage: page => {
                      this.setState({
                        page
                      });
                    },
                    pageLength: this.state.pageLength,
                    setPageLength: pageLength => {
                      this.setState({
                        pageLength
                      });
                    }
                  }}
                />
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}

export default withRouter(withStyles(useStyles)(withSnackbar(Blogs)));
