import React, { useContext, useState, useRef, useEffect } from "react";
import { ClientContext } from "../context/ClientProvider";
import { formatDate, trimText } from "../../../utils/helper";
import { ButtonBase } from "@material-ui/core";

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

  const toBlog = () => {
    if (blog) {
      clientContext.toBlog(blog);
    }
  };

  return blog ? (
    <div className={`blog-card ${props.type || "normal"}`}>
      <div className="blog-card-image">
        <img
          src={blog.thumbnail}
          alt={blog.thumbnail}
        />
      </div>
      <div className="blog-card-content">
        <div className="blog-card-infor">
          by{" "}
          <span className="blog-upload">
            {blog.upload_id === -1 ? "Admin" : "Client"}
          </span>{" "}
          /{" "}
          <span className="blog-time">
            {formatDate(blog.createdAt, 2).format}
          </span>
        </div>
        <div className="blog-card-title" onClick={toBlog}>{blog.title}</div>
        <div className="blog-card-des">{trimText(blog.content)}</div>

        <ButtonBase className="btn-card-wrapper" style={{width: '240px'}} onClick={toBlog}>
          <div className="btn-card">
            Read More
            <i className="fas fa-angle-right"></i>
          </div>
        </ButtonBase>
      </div>
    </div>
  ) : null;
}
