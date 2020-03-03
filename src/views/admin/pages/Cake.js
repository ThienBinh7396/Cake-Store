import React from "react";
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
  Select,
  Checkbox,
  ButtonBase,
  TextField,
  Chip
} from "@material-ui/core";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AdminContext } from "./../context/AdminProvider";
import { withRouter } from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import BaseWrapperImage from "../../../common/component/BaseWrapperImage";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import BaseDialog from "../../../common/component/BaseDialog";
import Categories from "./Categories";

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
const filter = createFilterOptions();

class Cake extends React.Component {
  static contextType = AdminContext;

  state = {
    axios: null,
    id: -1,
    type: "save",
    openDialog: false,
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
    categories: null,
    tempCategory: "",
    category: {
      value: [],
      validate: () => {
        return this.state.category.value.length !== 0;
      }
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
    let id = this.props.match.params.id;

    let products = this.context.products.data;

    console.log("%c Products update", "color: red;font-size: 30px");

    let _product =
      products && id ? products.find(it => it.id === Number(id)) : null;
    console.log(_product);
    console.log(products);
    console.log(id);

    if (id && !_product) {
      this.context.products.addOne(Number(id));
      return;
    }

    if (id && _product) {
      setTimeout(() => {
        if (this.editor) {
          try {
            this.editor.setData(_product.description);
          } catch (error) {}
        }
      }, 100);

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
        category: {
          ...this.state.category,
          value: _product.Categories
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
        category: {
          ...this.state.category,
          value: []
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
    let { loadingComponent, axios, categories } = this.context;

    this.setState(
      {
        axios,
        categories
      },
      () => {
        if (categories.data === null) {
          categories.fetchData();
          loadingComponent.updateState(true);
        }
      }
    );

    this.updateCakeFromStore();
  }

  compareArray = (arr1, arr2, field) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length === 0 && arr2.length === 0) return true;
    if (arr1.length !== arr2.length) return false;

    return arr1.every((value, index) => {
      return field
        ? value[field] === arr2[index][field]
        : value === arr2[index];
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { categories } = this.context;
    const { adminContext } = prevProps;

    if (categories !== adminContext.categories) {
      console.log("update Categories");
      this.setState({
        categories
      });
    }
    console.log("SHOW CONTEXT");
    console.log(prevProps);
    console.log(this.context);

    if (
      this.context.products.data !== null &&
      !this.compareArray(
        adminContext.products.data || [],
        this.context.products.data,
        "id"
      )
    ) {
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

    const handleSaveBtn = async () => {
      this.setState({
        isSubmitting: true
      });

      if (
        !this.state.title.validate() ||
        !this.state.price.validate() ||
        !this.state.category.validate()
      ) {
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
        let uploadResult = await this.state.axios.uploadFile(formData);
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
        let uploadResult = await this.state.axios.uploadFile(formData);

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
          url: `admin/products/${
            this.state.type === "save" ? "create" : "update"
          }`,
          method: "POST",

          data: {
            id: this.state.id,
            title: this.state.title.value,
            price: this.state.price.value,
            discount: this.state.discount.value,
            description: this.state.description.value,
            status: this.state.status.value,
            thumbnail: this.state.thumbnail.url,
            gallery: this.state.gallery,
            categories: this.state.category.value.map(it => {
              return { id: it.id, title: it.title, alias: it.alias };
            })
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
        <BaseDialog
          maxWidth="xs"
          fullWidth={true}
          title="Add New Category"
          open={this.state.openDialog}
          onClose={() => {
            this.setState({ openDialog: false });
          }}
          type="component"
        >
          <Categories embed tempTitle={this.state.tempCategory} />
        </BaseDialog>

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
                <Grid container>
                  <Grid item xs={12} className="linear-transition">
                    <Box className="simple-form" mb={1.75}>
                      <label>Categories:</label>
                      {
                        <Autocomplete
                          id="demo-mutiple-chip"
                          multiple
                          className={
                            !this.state.category.validate() ? "error" : null
                          }
                          options={
                            this.state.categories && this.state.categories.data
                              ? this.state.categories.data
                              : []
                          }
                          value={
                            this.state.category && this.state.category.value
                              ? this.state.category.value
                              : []
                          }
                          onChange={(event, newValue) => {
                            console.log("Value: .......", event);
                            console.log("Value: .......", newValue);

                            this.setState({
                              category: {
                                ...this.state.category,
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
                                title: `Add category "${params.inputValue}"`
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
                                      checked={
                                        this.state.category.value.findIndex(
                                          it => option.id === it.id
                                        ) >= 0
                                      }
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
                              value={this.state.tempCategory}
                              onChange={e => {
                                this.setState({
                                  tempCategory: e.target.value
                                });
                              }}
                              variant="outlined"
                              placeholder="Choose at least category!"
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {this.state.categories &&
                                      this.state.categories.loading && (
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
                      <Box className="helper-text">
                        Choose at least category!
                      </Box>
                    </Box>
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
                          this.editor = editor;
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

const withAdminContext = Element => {
  return React.forwardRef((props, ref) => {
    return (
      <AdminContext.Consumer>
        {context => <Element adminContext={context} {...props} ref={ref} />}
      </AdminContext.Consumer>
    );
  });
};

export default withStyles(useStyles)(
  withSnackbar(withAdminContext(withRouter(Cake)))
);
