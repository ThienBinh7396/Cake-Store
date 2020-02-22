import React, { useContext } from "react";
import { PropTypes } from "prop-types";
import { ClientContext } from "./../context/ClientProvider";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Rating } from "@material-ui/lab";

function ProductCard(props) {
  const client = useContext(ClientContext);
  const [product, setProduct] = useState(null);
  const lastestProps = useRef(props);

  useEffect(() => {
    if (client.products.data) {
      let { id } = lastestProps.current.id;

      setProduct(client.products.data.find(it => it.id === id));
    }
  }, [client.products]);

  return (
    <div>
      {product && (
        <div className="card-product">
          <div
            className="card-product-image"
            style={{
              backgroundImage: `url(${product.thumbnail})`
            }}
          ></div>
          <div className="card-product-rate">
            <Rating precision={0.5} />
          </div>
          <div className="card-product-title">{product.title}</div>
          <div className="card-product-price">${product.price}</div>
          <div className="card-product-action">Add to card</div>
        </div>
      )}
    </div>
  );
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired
};

export default ProductCard;
