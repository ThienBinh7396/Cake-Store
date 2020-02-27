import React, { useContext, useState, useRef } from "react";
import { ClientContext } from "./../context/ClientProvider";
import { useEffect } from "react";
import { Rating } from "@material-ui/lab";

export default function FeedbackCard(props) {
  const clientContext = useContext(ClientContext);
  const [feedback, setFeedback] = useState(null);

  const lastestProps = useRef(props);

  useEffect(() => {
    if (clientContext.feedback.data) {
      let { id } = lastestProps.current;

      if (id) {
        setFeedback(clientContext.feedback.data.filter(it => it.id === id)[0]);
      }
    }
  }, [clientContext.feedback]);

  return (
    feedback && (
      <div className="card-feedback">
        <div className="card-feedback-thumbnail">
          <img src={feedback.thumbnail || '/img/avatar.png'} alt={feedback.thumbnail} />
        </div>
        <Rating
          disabled
          precision={0.5}
          value={feedback.rate}
          name="rating-product"
          className="card-feedback-rating"
          icon={<i className="far fa-star"></i>}
          style={{ color: "#fa6e75" }}
        />
        <div className="card-feedback-title">
          <strong>{feedback.name}</strong> - {feedback.email}
        </div>
        <div className="card-feedback-content">{feedback.content}</div>
      </div>
    )
  );
}
