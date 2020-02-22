import React from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import {
  Grid,
  withStyles,
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select
} from "@material-ui/core";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AdminContext } from "./../context/AdminProvider";
import { withRouter } from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import BaseWrapperImage from "../../../common/component/BaseWrapperImage";

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

class Cake extends React.Component {
  static contextType = AdminContext;

  constructor(props) {
    super(props);
    this.axios = props.admin.axios;
  }

  state = {
    axios: null,
    id: -1,
    type: "save",
    isSubmitting: false,
    title: {
      value: "",
      helperText: () => {
        return !this.state.title.validate() ? "Title field is required!" : null;
      },
      validate: () => {
        return !!this.state.title.value;
      }
    },
    price: {
      value: 0.0,
      helperText: () => {
        return !this.state.price.validate() ? "Price is greater than 0!" : null;
      },
      validate: () => {
        return this.state.price.value > 0;
      }
    },
    discount: {
      value: 0
    },
    description: {
      value: ""
    },
    status: {
      value: "available",
      data: [
        {
          label: "available",
          text: "Available",
          color: "#48ce4e"
        },
        {
          label: "busy",
          text: "Busy",
          color: "#ff8e00"
        },
        {
          label: "unavailable",
          text: "Unavailable",
          color: "#ff0101"
        }
      ]
    },
    thumbnail: {
      default: "/img/birthday-cake.jpg",
      file: null,
      url: "/img/birthday-cake.jpg"
    },
    gallery: []
  };

  updateCakeFromStore() {
    console.log(this.props);
    let id = Number(this.props.match.params.id);

    let products = this.context.products.data;

    console.log("%c Products update", "color: red; font-size: 30px");

    let _product = products ? products.find(it => it.id === id) : null;
    console.log(_product);
    console.log(products);
    console.log(id);

    if (_product) {
      this.setState({
        id: _product.id,
        type: "update",
        title: {
          ...this.state.title,
          value: _product.title
        },
        price: {
          ...this.state.price,
          value: _product.price
        },
        discount: {
          ...this.state.discount,
          value: _product.discount
        },
        description: {
          ...this.state.description,
          value: _product.description
        },
        status: {
          ...this.state.status,
          value: _product.status
        },
        thumbnail: {
          ...this.state.thumbnail,
          url: _product.thumbnail
        },
        gallery: [
          ..._product.gallery.map(it => {
            return {
              id: it.id,
              file: null,
              url: it.url,
              status: "success"
            };
          })
        ]
      });
    } else {
      this.setState({
        type: "save",
        title: {
          ...this.state.title,
          value: ""
        },
        price: {
          ...this.state.price,
          value: 0.0
        },
        discount: {
          ...this.state.discount,
          value: 0
        },
        description: {
          ...this.state.description,
          value: ""
        },
        status: {
          ...this.state.status,
          value: "available"
        },
        thumbnail: {
          ...this.state.thumbnail,
          url: "/img/birthday-cake.jpg"
        },
        gallery: []
      });
    }
  }

  componentDidMount() {
    document.title = "Admin - Cakes Page";

    this.progressDialog = this.context.progressDialog;

    console.log("product");
    let { products, loadingComponent, axios } = this.context;

    if (products && !products.data) {
      products.fetchProduct();
      loadingComponent.updateState(true);
      console.log("fetch product");
    }

    this.setState({
      axios
    })

    this.updateCakeFromStore();
  }

  componentDidUpdate(prevProps, prevState) {
    const { adminContext } = this.props;
    if (adminContext.products !== prevProps.adminContext.products) {
      console.log("%cDid Update", "color: red; font-size: 30px");
      this.updateCakeFromStore();
    }
  }

  render() {
    const { classes } = this.props;

    const { enqueueSnackbar } = this.props;

    const statusColor = {
      success: "transparent",
      successful: "#5ab55e",
      waitting: "#febf09",
      error: "#ff0101"
    };

    console.log("update " + new Date());

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

    const handleThumbnailInput = e => {
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

    const updateGallery = ({ type, url, files }) => {
      let _gallery;

      switch (type) {
        case "remove": {
          _gallery = this.state.gallery.filter(it => it.url !== url);

          break;
        }
        case "add": {
          let _url = [];

          for (var i = 0; i < files.length; i++) {
            _url.push({
              id: `${new Date().getTime()}${i}`,
              url: URL.createObjectURL(files[i]),
              file: files[i],
              status: "waitting"
            });
          }

          _gallery = [...this.state.gallery, ..._url];
          break;
        }
        default:
      }

      this.setState(
        {
          gallery: _gallery
        },
        () => {
          console.log("%c Update gallery: ", "color: green");
          console.log(this.state.gallery, "color: green");
        }
      );
    };

    const updateMultiFile = e => {
      let files = e.target.files;

      if (files.length !== 0) {
        updateGallery({ type: "add", files });
      }
      setTimeout(() => {
        document.getElementById("js-input-multi-file").value = null;
      });
    };

    const config = {
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

    const showToast = (message, type) => {
      enqueueSnackbar(message, { variant: type });
    };

    const uploadFile = async formData => {
      return new Promise(res => {
        this.state.axios
          .connect({
            url: "uploadFile",
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data"
            },
            data: formData
          })
          .then(rs => {
            const { data } = rs.data;

            res(data);
          })
          .catch(err => {
            res(null);
          });
      });
    };

    const handleSaveBtn = async () => {
      this.setState({
        isSubmitting: true
      });

      if (!this.state.title.validate() || !this.state.price.validate()) {
        this.setState({
          isSubmitting: false
        });

        showToast(
          this.state.title.helperText() || this.state.price.helperText(),
          "warning"
        );
        return;
      }

      this.progressDialog.updateState(true, "Submitting...");
      let uploadImage = this.state.gallery.filter(it => it.file !== null);

      let formData = new FormData();

      uploadImage.forEach((it, index) => {
        formData.append(`${it.id}`, it.file);
      });

      if (uploadImage.length !== 0) {
        let uploadResult = await uploadFile(formData);
        if (!uploadResult) {
          showToast("Upload gallery failed!", "warning");
          this.setState({
            isSubmitting: false
          });
          this.progressDialog.updateState(false, "Submitting...");
          return;
        }

        uploadImage = uploadImage.map(it => {
          let _find = uploadResult.filter(
            _result => it.id === Object.keys(_result)[0]
          )[0][it.id];
          return {
            ...it,
            file: _find.status === "successful" ? null : it.file,
            url: _find.path,
            status: _find.status
          };
        });

        let _gallery = this.state.gallery.map(it => {
          let filter = uploadImage.filter(
            _uploadImage => _uploadImage.id === it.id
          );
          if (filter.length !== 0) {
            return filter[0];
          }
          return it;
        });
        console.log("gallery...");

        this.setState({
          gallery: _gallery
        });
      }

      formData = new FormData();

      if (this.state.thumbnail.file !== null) {
        formData.append("thumbnail", this.state.thumbnail.file);
        let uploadResult = await uploadFile(formData);

        if (
          !uploadResult ||
          uploadResult[0].thumbnail.status !== "successful"
        ) {
          showToast("Upload gallery failed!", "warning");
          this.setState({
            isSubmitting: false
          });
          this.progressDialog.updateState(false, "Submitting...");
          return;
        }

        this.setState({
          thumbnail: {
            ...this.state.thumbnail,
            file: null,
            url: uploadResult[0].thumbnail.path
          }
        });
        console.log(uploadResult);
      }
      console.log(this.state);

      formData = new FormData();

      this.state.axios
      .connect({
        url:  `admin/products/${this.state.type === "save" ? "create" : "update"}`,
        method: "POST",
     
        data:  {
          id: this.state.id,
          title: this.state.title.value,
          price: this.state.price.value,
          discount: this.state.discount.value,
          description: this.state.description.value,
          status: this.state.status.value,
          thumbnail: this.state.thumbnail.url,
          gallery: this.state.gallery
        }
      })
        .then(rs => {
          let { data, type, message } = rs.data;

          console.log(data, type, message);
          if (type === "success") {
            this.context.products.update(data);
            setTimeout(() => {
              this.props.history.push(`/admin/cake`);
            }, 150);
          }
          showToast(message, type);
          this.setState({
            isSubmitting: false
          });
          this.progressDialog.updateState(false, "Submitting...");
        })
        .catch(err => {
          showToast("Create product failed!", "error");
          this.setState({
            isSubmitting: false
          });
          this.progressDialog.updateState(false, "Submitting...");
        });
    };

    return (
      <Box className={classes.root}>
        <Grid container>
          <Grid item sm={8} xs={12} className={classes.paperContainer}>
            <Card className={"paper"}>
              <Typography className={"title"}>Cakes</Typography>
              <form className="fullWidth">
                <div className="simple-form">
                  <label>Title:</label>
                  <div className="simple-form-input">
                    <input
                      placeholder="Title..."
                      value={this.state.title.value}
                      className={this.state.title.validate() ? "" : "error"}
                      onChange={e => handleChange("title", e.target.value)}
                    ></input>
                    <div className="helper-text">
                      {this.state.title.helperText()}
                    </div>
                  </div>
                </div>
                <Grid container>
                  <Grid item sm={4} xs={12}>
                    <div className="simple-form">
                      <label>Price:</label>
                      <div className="simple-form-input">
                        <input
                          placeholder="Price..."
                          type="number"
                          style={{ width: "calc(100% - 16px)" }}
                          className={this.state.price.validate() ? "" : "error"}
                          value={this.state.price.value}
                          onChange={e => handleChange("price", e.target.value)}
                        ></input>
                        <div className="helper-text">
                          {this.state.price.helperText()}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <div className="simple-form">
                      <label>Discount:</label>
                      <div className="simple-form-input">
                        <input
                          placeholder="Discount..."
                          type="number"
                          style={{ width: "calc(100% - 16px)" }}
                          value={this.state.discount.value}
                          onChange={e =>
                            handleChange("discount", e.target.value)
                          }
                        ></input>
                        <div className="helper-text">
                          {this.state.title.helperText()}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <div className="simple-form">
                      <label>Status:</label>
                      <FormControl className={classes.baseSelect}>
                        <Select
                          value={this.state.status.value}
                          style={{
                            backgroundColor: this.state.status.data[
                              this.state.status.data.findIndex(
                                it => it.label === this.state.status.value
                              )
                            ].color
                          }}
                          onChange={event =>
                            handleChange("status", event.target.value)
                          }
                        >
                          {this.state.status.data.map(_status => (
                            <MenuItem
                              key={"select-" + _status.label}
                              value={_status.label}
                              style={{
                                color: _status.color,
                                margin: "0 8px 4px"
                              }}
                            >
                              {_status.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <div className="simple-form">
                  <label>Description:</label>
                  <div className="simple-form-input">
                    <Box mb={2}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={this.state.description.value}
                        config={config}
                        onInit={editor => {
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();

                          handleChange("description", data);
                          console.log({ event, editor, data });
                        }}
                      />
                    </Box>
                  </div>
                </div>

                <Button
                  variant="contained"
                  style={{ marginTop: "4px" }}
                  color="primary"
                  onClick={handleSaveBtn}
                  size={"small"}
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
            <Card className={"paper"}>
              <div className="simple-form">
                <label>Thumbnail: </label>
                <div className="simple-form-input clear-margin">
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                    onChange={handleThumbnailInput}
                  ></input>
                  <BaseWrapperImage
                    mt={2}
                    image={this.state.thumbnail.url}
                    width="100%"
                  />
                </div>
              </div>
            </Card>
            <Box component={Card} mt={2} className={"paper"}>
              <div className="simple-form">
                <label>Gallery: </label>

                <QueueAnim
                  className="preview-upload-multi"
                  type={["right", "left"]}
                  ease={["easeOutQuart", "easeInOutQuart"]}
                >
                  <div
                    className="preview-single input-wrapper"
                    key={`#gallery`}
                  >
                    <input
                      id="js-input-multi-file"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={updateMultiFile}
                    ></input>
                  </div>
                  {this.state.gallery.map((it, index) => (
                    <div
                      key={`#gallery-${index}`}
                      className="preview-single"
                      style={{ borderColor: statusColor[it.status] }}
                    >
                      <div>#{index}</div>
                      <div
                        className="preview-single-image"
                        style={{ backgroundImage: `url(${it.url})` }}
                      ></div>
                      <div
                        className="preview-remove-image"
                        onClick={() => updateGallery({ type: "remove", ...it })}
                      >
                        <i className="fas fa-times"></i>
                      </div>
                    </div>
                  ))}
                </QueueAnim>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    admin: state.admin
  };
};

const withAdminContext = Element => {
  return React.forwardRef((props, ref) => {
    return (
      <AdminContext.Consumer>
        {context => <Element adminContext={context} {...props} ref={ref} />}
      </AdminContext.Consumer>
    );
  });
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(useStyles)(withSnackbar(withAdminContext(withRouter(Cake)))));
