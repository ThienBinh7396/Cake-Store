import React from "react";
import {
  withStyles,
  Box,
  Grid,
  TableContainer,
  Paper,
  TableHead,
  Table,
  Card,
  TableBody,
  ButtonBase,
  Typography
} from "@material-ui/core";
import {
  StyledTableRow,
  StyledTableCell,
  StyledTableHelperRow,
  StyledTablePagination
} from "../../../common/component/StyledTable";
import { AdminContext } from "../context/AdminProvider";
import BaseIcon from "../../../common/component/BaseIcon";

import * as Helper from "../../../common/helper";
import BaseButton from "../../../common/component/BaseButton";
import QueueAnim from "rc-queue-anim";
import BaseDialog from "../../../common/component/BaseDialog";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

const useStyles = theme => ({
  paperContainer: {
    padding: "16px 8px",
    "& .paper": {
      color: theme.palette.text.main,
      padding: "12px 20px 20px 20px",
      boxShadow:
        "0 0.46875rem 2.1875rem rgba(8,10,37,.03), 0 0.9375rem 1.40625rem rgba(8,10,37,.03), 0 0.25rem 0.53125rem rgba(8,10,37,.05), 0 0.125rem 0.1875rem rgba(8,10,37,.03)",
      transition: ".2s",
      "& .title": {
        textTransform: "uppercase",
        color: "rgba(18,21,78,.7)",
        fontSize: "1rem",
        fontWeight: "bold",
        marginBottom: ".75rem"
      }
    }
  },
  tableWrapper: {
    padding: "12px 16px",
    boxShadow:
      "0 0.46875rem 2.1875rem rgba(8,10,37,.03), 0 0.9375rem 1.40625rem rgba(8,10,37,.03), 0 0.25rem 0.53125rem rgba(8,10,37,.05), 0 0.125rem 0.1875rem rgba(8,10,37,.03)",
    transition: ".2s"
  },
  baseSelect: {
    borderRadius: "4px",
    overflow: "hidden",
    "& .MuiSelect-select.MuiSelect-select": {
      borderRadius: "4px",
      backgroundColor: "inherit",
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

class Tags extends React.Component {
  static contextType = AdminContext;

  constructor(props) {
    super(props);
    this.axios = props.admin.axios;

    this.enqueueSnackbar = props.enqueueSnackbar;

    this.showToast = (message, type = "default") => {
      this.enqueueSnackbar(message, { variant: type });
    };
  }

  state = {
    axios: null,
    showDialog: false,
    type: "add",
    id: -1,
    title: {
      value: "",
      helperText: () => {
        return !this.state.title.validate() ? "Title field is required" : "";
      },
      validate: () => {
        return !!this.state.title.value;
      }
    },
    columns: [
      {
        title: "No",
        field: "no"
      },
      {
        title: "Title",
        field: "title"
      },
      {
        title: "Alias",
        field: "alias"
      },
      {
        title: "Time",
        field: "createdAt"
      },
      {
        title: "Actions",
        field: "action"
      }
    ],
    tags: null,
    tag: null,
    page: 0,
    pageLength: 5
  };

  componentDidMount() {
    document.title = "Admin - Tags Page";
    const { tags, loadingComponent, progressDialog, axios } = this.context;

    if (this.props.tempTitle) {
      this.handleChange("title", this.props.tempTitle);
    }
    this.progressDialog = progressDialog;

    this.setState({
      tags,
      axios
    });

    if (tags && !tags.data) {
      tags.fetchData();
      loadingComponent.updateState(true);
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    const { tags } = this.context;

    const { adminContext } = prevProps;

    if (tags !== adminContext.tags) {
      this.setState({
        tags
      });

      console.log(this.state);
    }
  }
  updateForm({ type, tag }) {
    let _state;
    switch (type) {
      case "reset": {
        _state = {
          ...this.state,
          type: "add",
          id: -1,
          title: {
            ...this.state.title,
            value: ""
          }
        };
        break;
      }
      case "update": {
        _state = {
          ...this.state,
          type: "update",
          id: tag.id,
          title: {
            ...this.state.title,
            value: tag.title
          }
        };
        break;
      }
      default:
        break;
    }

    this.setState(_state);
  }
  checkInRange = index => {
    console.log(index);
    return (
      this.state.page * this.state.pageLength <= index &&
      (this.state.page + 1) * this.state.pageLength > index
    );
  };

  renderRow = ({ it, index }) => {
    return (
      <StyledTableRow
        key={`#row-${index}`}
        style={{
          display: this.checkInRange(index) ? "table-row" : "none"
        }}
        className={it.id === this.state.id ? "active" : ""}
      >
        {this.state.columns.map((_column, i) => {
          switch (_column.field) {
            case "no": {
              return (
                <StyledTableCell key={`#colume-${i}`}>
                  <strong>{index + 1}</strong>
                </StyledTableCell>
              );
            }
            case "title":
            case "alias": {
              return (
                <StyledTableCell key={`#colume-${i}`}>
                  <Box className="text-truncate" style={{ width: "120px" }}>
                    {it[_column.field]}
                  </Box>
                </StyledTableCell>
              );
            }
            case "action": {
              return (
                <StyledTableCell key={`#colume-${i}`}>
                  <ButtonBase
                    className="button-icon round"
                    style={{
                      background: "#48ce4e",
                      marginRight: "4px"
                    }}
                    onClick={() => {
                      this.updateForm({ type: "update", tag: it });
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
                      this.setState({ showDialog: true, tag: it });
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
            }
            case "createdAt": {
              return (
                <StyledTableCell key={`#colume-${i}`}>
                  {Helper.formatDate(it.createdAt, 3).format}
                </StyledTableCell>
              );
            }
            default:
              return (
                <StyledTableCell key={`#colume-${i}`}>
                  {it[_column.field] ? (
                    it[_column.field]
                  ) : (
                    <div className="text-blur">NULL</div>
                  )}
                </StyledTableCell>
              );
          }
        })}
      </StyledTableRow>
    );
  };

  handleChange(target, value) {
    let obj = {
      ...this.state[target],
      value
    };

    let _state = {};

    _state[target] = obj;

    this.setState(_state);
  }

  controlTag() {
    if (!this.state.title.validate()) {
      this.showToast(this.state.title.helperText(), "warning");
      return;
    }
    this.progressDialog.updateState(true, "Submitting...");

    this.state.axios
      .connect({
        method: "POST",
        url: `admin/blogTags/${
          this.state.type === "add" ? "create" : "update"
        }`,
        data: {
          id: this.state.tag ? this.state.tag.id : -1,
          title: this.state.title.value,
          alias: Helper.change_alias(this.state.title.value)
        }
      })
      .then(rs => {
        this.progressDialog.updateState(false, "Submitting...");

        let { data, type, message } = rs.data;
        this.showToast(message, type);
        if (type === "success") {
          this.state.tags.controlData({ type: this.state.type, tag: data });
          this.updateForm({ type: "reset" });
        }
      })
      .catch(err => {
        this.progressDialog.updateState(false, "Submitting...");
        this.showToast("Action failed", "error");
      });
  }

  deleteTag() {
    if (!this.state.tag) return;

    this.progressDialog.updateState(true, "Deleting...");

    this.state.axios
      .connect({
        method: "POST",
        url: "admin/blogTags/delete",
        data: {
          id: this.state.tag.id
        }
      })
      .then(rs => {
        let { type, message } = rs.data;

        this.showToast(message, type);
        if (type === "success") {
          this.state.tags.controlData({
            type: "delete",
            tag: this.state.tag
          });
        }

        this.progressDialog.updateState(false, "Deleting...");
      })
      .catch(err => {
        this.showToast("Delete product failed!", "error");
        this.progressDialog.updateState(false, "Deleting...");
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Box>
        <BaseDialog
          style={{ zIndex: 100 }}
          open={this.state.showDialog}
          maxWidth="xs"
          fullWidth={true}
          title="Comfirm"
          type="text"
          onClose={() => {
            this.setState({ showDialog: false });
          }}
          onSubmit={() => {
            if (this.state.tag) {
              this.deleteTag();
            }
            this.setState({ showDialog: false });
          }}
        >
          <strong style={{ color: "#2f55b7" }}>Are you sure?</strong> You won't
          be able to revert this!
        </BaseDialog>
        <Grid container>
          <Grid
            item
            sm={this.props.embed ? 12 : 4}
            xs={12}
            className={classes.paperContainer}
            style={{ padding: this.props.embed ? "0" : null }}
          >
            <Card className="paper">
              <Typography className={"title"}>Tags</Typography>
              <form className="fullWidth">
                <div className="simple-form">
                  <label>Title:</label>
                  <div className="simple-form-input">
                    <input
                      placeholder="Title..."
                      value={this.state.title.value}
                      className={this.state.title.validate() ? "" : "error"}
                      onChange={e => this.handleChange("title", e.target.value)}
                    ></input>
                    <div className="helper-text">
                      {this.state.title.helperText()}
                    </div>
                  </div>
                </div>
                <div className="simple-form">
                  <label>Alias:</label>
                  <div className="simple-form-input">
                    <input
                      disabled
                      placeholder="Alias..."
                      value={Helper.change_alias(this.state.title.value)}
                    ></input>
                  </div>
                </div>
                <Box display="flex" alignItems="center">
                  <BaseButton
                    color="#3f6ad8"
                    margin="0 4px 0 0"
                    onClick={() => {
                      this.controlTag();
                    }}
                  >
                    {this.state.type}
                  </BaseButton>
                  <QueueAnim
                    animConfig={[
                      { scale: [1, 0.5], opacity: [1, 0] },
                      { scale: [1, 0.5], opacity: [1, 0] }
                    ]}
                  >
                    {this.state.type === "update" && (
                      <Box key="#affff">
                        <BaseButton
                          color="#48CE4E"
                          onClick={() => {
                            this.updateForm({ type: "reset" });
                          }}
                        >
                          Cancel
                        </BaseButton>
                      </Box>
                    )}
                  </QueueAnim>
                </Box>
              </form>
            </Card>
          </Grid>
          {!this.props.embed && (
            <Grid item sm={8} xs={12} className={classes.paperContainer}>
              <TableContainer
                component={Paper}
                className={classes.tableWrapper}
              >
                <Table className="table-data">
                  <TableHead>
                    <StyledTableRow>
                      {this.state.columns.map(it => (
                        <StyledTableCell key={it.title}>
                          {it.title}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.tags && this.state.tags.loading && (
                      <StyledTableHelperRow
                        loading={this.state.tags.loading}
                        columns={this.state.columns.length}
                        type="loading"
                      />
                    )}
                    {this.state.tags &&
                      !this.state.tags.loading &&
                      (!this.state.tags.data ||
                        this.state.tags.data.length === 0) && (
                        <StyledTableHelperRow
                          loading={this.state.tags.loading}
                          columns={this.state.columns.length}
                          type="no-data"
                        />
                      )}
                    {this.state.tags &&
                      !this.state.tags.loading &&
                      this.state.tags.data &&
                      this.state.tags.data.length !== 0 &&
                      this.state.tags.data.map((it, index) =>
                        this.renderRow({ ...{ it, index } })
                      )}

                    {this.state.tags && (
                      <StyledTablePagination
                        {...{
                          colSpan: this.state.columns.length,
                          data: this.state.tags.data,
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
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }
}

const withAdminContext = Element => {
  return React.forwardRef((props, ref) => {
    return (
      <AdminContext.Consumer>
        {context => <Element adminContext={context} {...props} ref={ref} />}
      </AdminContext.Consumer>
    );
  });
};
const mapStateToProps = state => {
  return {
    admin: state.admin
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(useStyles)(withAdminContext(withSnackbar(Tags))));
