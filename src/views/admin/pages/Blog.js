import React, { Component } from "react";
import {
  withStyles,
  Box,
  Grid,
  Card,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  Chip,
  Checkbox,
  ButtonBase,
  TextField,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AdminContext } from "./../context/AdminProvider";
import BaseDialog from "./../../../common/component/BaseDialog";
import Tags from "./Tags";
import { withSnackbar } from "notistack";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BaseWrapperImage from "../../../common/component/BaseWrapperImage";
import BaseRadioButton from "./../../../common/component/BaseRadioButton";

const useStyles = theme => ({
  root: {
    flexGrow: 1
  },
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
  baseSelect: {
    width: "calc(100% - 24px)",
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

const filter = createFilterOptions();

export class Blog extends Component {
  static contextType = AdminContext;

  constructor(props) {
    super(props);

    this.showToast = (message, type = "default") => {
      props.enqueueSnackbar(message, { variant: type });
    };

    this.config = {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "alignment",
        "blockQuote",
        "undo",
        "redo"
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph"
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1"
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2"
          }
        ]
      },
      placeholder: "Type something...",
      height: "180px"
    };
  }

  state = {
    axios: null,
    id: -1,
    openDialog: false,
    isSubmitting: false,
    type: "add",
    title: {
      value: "",
      helperText: () => {
        return !this.state.title.validate() ? "Title field is required!" : "";
      },
      validate: () => {
        return !!this.state.title.value;
      }
    },
    content: {
      value: "",
      defaultValue: "This is content of blog..."
    },
    status: {
      value: 0,
      data: [
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
    },
    thumbnail: {
      default: "/img/blog-cake.jpg",
      file: null,
      url: "/img/blog-cake.jpg"
    },
    tags: null,
    tempTag: "",
    blogTag: {
      value: [],
      validate: () => {
        return this.state.blogTag.value.length !== 0;
      }
    },
    blogs: null
  };

  updateFromStore() {
    let { id } = this.props.match.params;
    console.log("Update from store", id, this.state);

    if (id) {
      if (!this.state.blogs || !this.state.blogs.data) return;

      let _blog = this.state.blogs.data.find(it => it.id === Number(id));

      if (!_blog) {
        this.showToast("Url is invalid. Try again!", "error");
        this.props.history.push("/admin/blog");
      } else {
        if (this.editor) {
          try {
            this.editor.setData(_blog.content);
          } catch (error) {}
        }

        this.setState(
          {
            id: _blog.id,
            type: "update",
            title: {
              ...this.state.title,
              value: _blog.title
            },
            content: {
              ...this.state.content,
              value: _blog.content
            },
            status: {
              ...this.state.status,
              value: _blog.status
            },
            thumbnail: {
              ...this.state.thumbnail,
              url: _blog.thumbnail
            },
            blogTag: {
              ...this.state.blogTag,
              value: _blog.BlogTags
            }
          },
          () => {
            console.log(this.state);
          }
        );
      }
    } else {
      this.setState({
        id: -1,
        type: "add",
        title: {
          ...this.state.title,
          value: ""
        },
        content: {
          ...this.state.content,
          value: ""
        },
        status: {
          ...this.state.status,
          value: 0
        },
        thumbnail: {
          ...this.state.thumbnail,
          url: this.state.thumbnail.default
        },
        blogTag: {
          ...this.state.blogTag,
          value: []
        }
      });
    }
  }

  componentDidMount() {
    console.log("%c Blog...", "color:blue;font-size:20px");

    document.title = "Admin - Blog Pages";

    this.axios = this.props.admin.axios;

    const {
      blogs,
      tags,
      loadingComponent,
      progressDialog,
      axios
    } = this.context;

    console.log(this.context);

    this.progressDialog = progressDialog;

    this.setState({ tags, blogs, axios }, () => {
      if (tags.data === null) {
        tags.fetchData();
        loadingComponent.updateState(true);
      }

      if (blogs.data === null) {
        blogs.fetchData();
        loadingComponent.updateState(true);
      }
      this.updateFromStore();
    });
  }
  componentDidUpdate(prevProps) {
    const { tags, blogs } = this.context;

    const { adminContext } = prevProps;
    if (tags !== adminContext.tags) {
      this.setState({
        tags
      });
    }

    if (blogs !== adminContext.blogs) {
      this.setState(
        {
          blogs
        },
        () => {
          this.updateFromStore();
        }
      );
    }
  }

  handleThumbnailInput = e => {
    console.log(e.target.nextSibling.style.height);
    //e.target.nextSibling.style.height =  `${e.target.nextSibling.children[0].offsetHeight}px`

    let file = e.target.files[0];

    let url = file ? URL.createObjectURL(file) : this.state.thumbnail.default;

    this.setState({
      thumbnail: {
        ...this.state.thumbnail,
        file,
        url
      }
    });
  };

  async uploadFile(file) {
    return new Promise(res => {
      let formData = new FormData();
      formData.append("file", file);

      this.state.axios
        .connect({
          method: "POST",
          url: "uploadFile",
          data: formData,
          header: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(rs => {
          let { data, type } = rs.data;
          res(type === "success" ? data : null);
        })
        .catch(err => {
          res(null);
        });
    });
  }

  handleControlBtn = async () => {
    if (!this.state.title.validate() || !this.state.blogTag.validate()) {
      this.showToast("Type required field!", "warning");
      return;
    }

    this.setState({
      isSubmitting: true
    });

    this.progressDialog.updateState(true, "Submitting...");

    let thumbnailUrl = this.state.thumbnail.url;

    if (this.state.thumbnail.file != null) {
      let resultUploadThumbnail = await this.uploadFile(
        this.state.thumbnail.file
      );

      if (
        !resultUploadThumbnail ||
        resultUploadThumbnail[0].file.status !== "successful"
      ) {
        this.showToast("Upload file failed!", "warning");
        this.setState({
          isSubmitting: false
        });
        this.progressDialog.updateState(false, "Submitting...");
        return;
      }

      thumbnailUrl = resultUploadThumbnail[0].file.path;

      this.setState({
        thumbnail: {
          ...this.state.thumbnail,
          file: null,
          url: resultUploadThumbnail[0].file.path
        }
      });
    }

    this.state.axios
      .connect({
        method: "POST",
        url: `admin/blog/${this.state.type === "add" ? "create" : "update"}`,
        data: {
          id: this.state.id,
          title: this.state.title.value,
          content: this.state.content.value || this.state.content.defaultValue,
          thumbnail: thumbnailUrl,
          status: this.state.status.value,
          tags: this.state.blogTag.value.map(it => {
            return { id: it.id, title: it.title, alias: it.alias };
          })
        }
      })
      .then(rs => {
        let { data, type, message } = rs.data;

        this.showToast(message, type);

        if (type === "success") {
          if (!this.state.blogs) {
            this.setState(
              {
                blogs: this.context.blogs
              },
              () => {
                this.state.blogs.updateData({
                  type: this.state.type,
                  blog: data
                });
              }
            );
          } else {
            this.state.blogs.updateData({ type: this.state.type, blog: data });
          }

          setTimeout(() => {
            this.props.history.push("/admin/blog");
          }, 1000);
        }
        this.setState({
          isSubmitting: false
        });
        this.progressDialog.updateState(false, "Submitting...");
      })
      .catch(err => {
        this.showToast("Action failed!", "error");
        this.setState({
          isSubmitting: false
        });
        this.progressDialog.updateState(false, "Submitting...");
      });
  };

  render() {
    const { classes } = this.props;

    const handleChange = (target, newVal) => {
      let obj = {
        ...this.state[target],
        value: newVal
      };

      let _state = {
        ...this.state
      };
      _state[target] = obj;

      this.setState({ ..._state });
    };

    return (
      <Box className={classes.root}>
        <BaseDialog
          maxWidth="xs"
          fullWidth={true}
          title="Add New Tags"
          open={this.state.openDialog}
          onClose={() => {
            this.setState({ openDialog: false });
          }}
          type="component"
        >
          <Tags embed tempTitle={this.state.tempTag} />
        </BaseDialog>
        <Grid container>
          <Grid
            item
            sm={8}
            xs={12}
            className={`${classes.paperContainer} linear-transition`}
          >
            <Card className="paper">
              <Typography className={"title"}>Blogs</Typography>
              <form className="fullWidth">
                <div className="simple-form">
                  <label>Title:</label>
                  <div className="simple-form-input">
                    <input
                      placeholder="Title..."
                      value={this.state.title.value}
                      className={this.state.title.validate() ? "" : "error"}
                      onChange={e => {
                        handleChange("title", e.target.value);
                      }}
                    ></input>
                    <div className="helper-text">
                      {this.state.title.helperText()}
                    </div>
                  </div>
                </div>

                <Grid container>
                  <Grid item xs={12} className="linear-transition">
                    <Box className="simple-form" mb={1.75}>
                      <label>Tags:</label>
                      {
                        <Autocomplete
                          id="demo-mutiple-chip"
                          multiple
                          className={
                            !this.state.blogTag.validate() ? "error" : null
                          }
                          options={
                            this.state.tags && this.state.tags.data
                              ? this.state.tags.data
                              : []
                          }
                          value={
                            this.state.blogTag && this.state.blogTag.value
                              ? this.state.blogTag.value
                              : []
                          }
                          onChange={(event, newValue) => {
                            console.log("Value: .......", event);
                            console.log("Value: .......", newValue);

                            this.setState({
                              blogTag: {
                                ...this.state.blogTag,
                                value: newValue
                                  .filter(it => !it.noRow)
                                  .reduce((arr, it) => {
                                    return arr.findIndex(
                                      _arr => _arr.id === it.id
                                    ) >= 0
                                      ? [...arr]
                                      : [...arr, it];
                                  }, [])
                              }
                            });
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            if (params.inputValue !== "") {
                              filtered.push({
                                inputValue: params.inputValue,
                                noRow: true,
                                title: `Add tag "${params.inputValue}"`
                              });
                            }

                            return filtered;
                          }}
                          getOptionLabel={option => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option.inputValue) {
                              return option.inputValue;
                            }
                            return option.title;
                          }}
                          renderOption={(option, { selected }) => {

                            return (
                              <Box
                                style={{ position: "relative", padding: "0px" }}
                                className="full-size"
                              >
                                {!option.noRow && (
                                  <React.Fragment>
                                    <Checkbox
                                      style={{ marginRight: 8, padding: "6px" }}
                                      checked={ this.state.blogTag.value.findIndex(it => option.id === it.id) >= 0}
                                    />
                                    {option.title}
                                  </React.Fragment>
                                )}
                                {option.noRow && (
                                  <ButtonBase
                                    className="full-size"
                                    style={{
                                      margin: "0px",
                                      color: "#3f6ad8",
                                      fontSize: "16px",
                                      padding: "6px 12px"
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        openDialog: true
                                      });
                                    }}
                                  >
                                    {option.title}
                                  </ButtonBase>
                                )}
                              </Box>
                            );
                          }}
                          loading={true}
                          renderInput={params => (
                            <TextField
                              {...params}
                              value={this.state.tempTag}
                              onChange={e => {
                                this.setState({
                                  tempTag: e.target.value
                                });
                              }}
                              variant="outlined"
                              placeholder="Choose at least tag!"
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {this.state.tags &&
                                      this.state.tags.loading && (
                                        <CircularProgress
                                          size={16}
                                          style={{
                                            position: "absolute",
                                            right: "36px"
                                          }}
                                        />
                                      )}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                )
                              }}
                              className="base-autocomplete"
                            />
                          )}
                          renderTags={(selected, getTagProps) =>
                            selected.map(
                              (value, index) =>
                                !value.noRow && (
                                  <Chip
                                    label={
                                      <Box fontSize={14}>#{value.title}</Box>
                                    }
                                    {...getTagProps({ index })}
                                  />
                                )
                            )
                          }
                        ></Autocomplete>
                      }
                      <Box className="helper-text">Choose at least tag!</Box>
                    </Box>
                  </Grid>
                </Grid>

                <div className="simple-form">
                  <label>Content:</label>
                  <div className="simple-form-input">
                    <Box mb={2}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={this.state.content.value}
                        config={this.config}
                        onInit={editor => {
                          this.editor = editor;
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();

                          handleChange("content", data);
                        }}
                      />
                    </Box>
                  </div>
                </div>
                <Button
                  variant="contained"
                  style={{ marginTop: "4px" }}
                  color="primary"
                  size={"small"}
                  onClick={() => {
                    this.handleControlBtn();
                  }}
                >
                  {this.state.isSubmitting ? (
                    <Box
                      style={{
                        padding: "4px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <CircularProgress mx={2} size={14} color="inherit" />
                    </Box>
                  ) : (
                    this.state.type
                  )}
                </Button>
              </form>
            </Card>
          </Grid>
          <Grid item sm={4} xs={12} className={classes.paperContainer}>
            <Box component={Card} mb={3} className={"paper"}>
              <div className="simple-form">
                <label>Thumbnail: </label>
                <div className="simple-form-input clear-margin">
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                    onChange={e => {
                      this.handleThumbnailInput(e);
                    }}
                  ></input>
                  <BaseWrapperImage
                    mt={2}
                    image={this.state.thumbnail.url}
                    width="100%"
                  />
                </div>
              </div>
            </Box>
            <Card className="paper simple-form">
              <label>Status:</label>

              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender2"
                  value={this.state.status.value}
                  onChange={e => {
                    handleChange("status", Number(e.target.value));
                  }}
                >
                  {this.state.status.data.map(_status => (
                    <FormControlLabel
                      key={"radio-" + _status.value}
                      value={_status.value}
                      label={_status.text}
                      control={<BaseRadioButton bcolor={_status.color} />}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        transform: "scale(.95)"
                      }}
                    ></FormControlLabel>
                  ))}
                </RadioGroup>
              </FormControl>
            </Card>
          </Grid>
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

const mapStateToProps = state => ({
  admin: state.admin
});

export default connect(
  mapStateToProps,
  {}
)(withAdminContext(withStyles(useStyles)(withSnackbar(withRouter(Blog)))));
