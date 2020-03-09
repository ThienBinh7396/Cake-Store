import React, { useContext } from "react";
import { PropTypes } from "prop-types";
import { ClientContext } from "./../context/ClientProvider";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Rating } from "@material-ui/lab";
import { ButtonBase, Box } from "@material-ui/core";
import LazyImage from "./../../../common/component/LazyImage";
import { withRouter } from "react-router-dom";
import ComponentWrapperHelper from "../../../common/component/ComponentWrapperHelper";

function ProductCard(props) {
  const client = useContext(ClientContext);
  const [product, setProduct] = useState(null);
  const lastestProps = useRef(props);

  const [type] = useState(props.type || "grid");

  useEffect(() => {
    if (client.products.data) {
      let { id } = lastestProps.current;
      setProduct(client.products.data.find(it => it.id === id));
    }
  }, [client.products]);

  const navigationToProductDetails = () => {
    props.history.push(`/product/${product.id}`);
  };

  const hightlightTitle = title => {
    if (!props.hightlighttitleregex) return title;

    return title.replace(props.hightlighttitleregex, match => {
      return `<strong >${match}</strong>`;
    });
  };

  return (
    <ComponentWrapperHelper>
      <div className="animated faster slideInUp">
        {product && (
          <div
            className={`card-product ${type} ${
              props.small ? "small-size" : ""
            }`}
          >
            {type === "grid" ? (
              <div
                className="card-product-image"
                // style={{
                //   backgroundImage: `url(${product.thumbnail})`
                // }}
              >
                <LazyImage
                  placeHolder={"/img/placeholder.png"}
                  src={product.thumbnail}
                  effect={"opacity"}
                  alt={product.thumbnail}
                />
                {product.discount !== 0 && (
                  <div className="card-product-discount">
                    <span>{product.discount}%</span>
                  </div>
                )}
                <div className="card-product-action">
                  <button
                    className="button-icon"
                    onClick={navigationToProductDetails}
                  >
                    <i className="pe-7s-search"></i>
                  </button>
                  <button className="button-icon">
                    <i className="far fa-heart"></i>
                  </button>
                  <button className="button-icon">
                    <i className="pe-7s-cart"></i>
                  </button>
                </div>
                {!props.norate && (
                  <div className="card-product-rate">
                    <Rating
                      precision={0.5}
                      value={product.rate}
                      size="small"
                      name="rating-product"
                      icon={<i className="far fa-star"></i>}
                      style={{ color: "#fa6e75" }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                className="card-product-image"
                // style={{
                //   backgroundImage: `url(${product.thumbnail})`
                // }}
              >
                <LazyImage
                  placeHolder={"/img/image-placeholder.webp"}
                  src={product.thumbnail}
                  effect={"opacity"}
                  alt={product.thumbnail}
                />
                {product.discount !== 0 && (
                  <div className="card-product-discount">
                    <span>{product.discount}%</span>
                  </div>
                )}
              </div>
            )}
            <div className="card-product-content">
              <div
                className="card-product-title"
                dangerouslySetInnerHTML={{
                  __html: props.hightlighttitleregex
                    ? hightlightTitle(product.title)
                    : product.title
                }}
              ></div>

              {type === "list" && !props.norate && (
                <div className="card-product-rate">
                  <Rating
                    precision={0.5}
                    value={product.rate}
                    size="small"
                    name="rating-product"
                    icon={<i className="far fa-star"></i>}
                    style={{ color: "#fa6e75" }}
                  />
                </div>
              )}
              {type === "list" && !props.small && (
                <div className="card-product-short-des">
                  {product.short_description}
                </div>
              )}
              <div className="card-product-price">
                {product.discount !== 0 && (
                  <span className="origin">${product.price}</span>
                )}
                <span className="real">
                  $
                  {((product.price * (100 - product.discount)) / 100).toFixed(
                    2
                  )}
                </span>
              </div>
              {type === "list" && (
                <Box display="flex" flexDirection="row">
                  <ButtonBase className="btn-card-wrapper btn-add-to-cart-large">
                    <div className="btn-card">
                      Add to cart
                      <i className="fas fa-angle-right"></i>
                    </div>
                  </ButtonBase>

                  <div className="card-product-action">
                    {!props.small && (
                      <>
                        <button className="button-icon">
                          <i className="pe-7s-search"></i>
                        </button>
                        <button className="button-icon">
                          <i className="far fa-heart"></i>
                        </button>
                        <button className="button-icon btn-add-to-cart-small">
                          <i className="pe-7s-cart"></i>
                        </button>
                      </>
                    )}
                  </div>
                </Box>
              )}
            </div>
          </div>
        )}
      </div>
    </ComponentWrapperHelper>
  );
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired
};

export default withRouter(ProductCard);
