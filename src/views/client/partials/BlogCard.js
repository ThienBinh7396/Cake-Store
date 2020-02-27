import React, { useContext, useState, useRef, useEffect } from "react";
import { ClientContext } from "../context/ClientProvider";
import { formatDate } from "../../../utils/helper";
import { ButtonBase } from "@material-ui/core";
import LazyImage from './../../../common/component/LazyImage';

export default function BlogCard(props) {
  const clientContext = useContext(ClientContext);

  const [blog, setBlog] = useState(null);
  const lastestProps = useRef(props);

  useEffect(() => {
    if (clientContext.blog.data) {
      let { id } = lastestProps.current;
      if (id) {
        setBlog(clientContext.blog.data.find(it => it.id === id));
      }
    }
  }, [clientContext.blog]);

  const trimText = text => {
    let div = document.createElement("div");
    div.innerHTML = text;

    let _text = div.innerText.substring(0, 100);
    div = null;

    return `${_text}...`;
  };

  return blog ? (
    <div className={`blog-card ${props.type || "normal"}`}>
      <div
        className="blog-card-image"
      >
         <LazyImage
                placeHolder={"/img/placeholder.png"}
                src={blog.thumbnail}
                effect={"opacity"}
                alt={blog.thumbnail}
              />
      </div>
      <div className="blog-card-content">
        <div className="blog-card-infor">
          by{" "}
          <span className="blog-upload">
            {blog.upload_id === -1 ? "Admin" : "Client"}
          </span>
          {" "}
          /{" "}
          <span className="blog-time">
            {formatDate(blog.createdAt, 2).format}
          </span>
        </div>
        <div className="blog-card-title">{blog.title}</div>
        <div className="blog-card-des">{trimText(blog.content)}</div>

        <ButtonBase className="btn-card-wrapper">
          <div className="btn-card">
            Read More
            <i className="fas fa-angle-right"></i>
          </div>
        </ButtonBase>
      </div>
    </div>
  ) : null;
}
