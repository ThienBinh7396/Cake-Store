import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import { Skeleton } from "@material-ui/lab";
import { Box } from "@material-ui/core";
import FeedbackCard from "../partials/FeedbackCard";
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import LoadingPlaceholder from "../../../common/component/LoadingPlaceholder";

export default class FeedbackSection extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    settings: {}
  };

  render() {
    const { feedback } = this.context;

    return (
     
        <section>
          <div
            className={
              !feedback || feedback.loading || !feedback.data
                ? ""
                : "feedback-section"
            }
            mt={4}
          >
            <Slider dots={true} autoplay={true} className="base-carousel dots">
              {!feedback || feedback.loading || !feedback.data
                ? [1, 2].map(it => (
                    <div
                      key={`#skeleton-section-product-${it}`}
                      className="skeletonFeedback"
                    >
                      <Skeleton variant="rect" animation="wave" height={520} />
                      <Box className="skeletonFeedbackContent">
                        <Skeleton
                          variant="circle"
                          width={102}
                          height={102}
                          animation="wave"
                          className="skeletonFeedbackItem avatar"
                        />
                        <Skeleton
                          animation="wave"
                          width={80}
                          style={{ marginTop: "8px" }}
                          className="skeletonFeedbackItem"
                        />
                        <Skeleton
                          animation="wave"
                          width={260}
                          className="skeletonFeedbackItem title"
                        />
                        <Skeleton
                          variant="rect"
                          animation="wave"
                          height={160}
                          style={{ marginTop: "24px" }}
                          className="skeletonFeedbackItem"
                        />
                      </Box>
                    </div>
                  ))
                : feedback.data.map(it => (
                    <FeedbackCard
                      key={`#feedback-section-${it.id}`}
                      id={it.id}
                    />
                  ))}
            </Slider>
          </div>
        </section>
    );
  }
}
