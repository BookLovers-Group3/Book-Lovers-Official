import { useState } from "react";
import reviews from "../../utils/Reviews";
import "./Review.scss";

function Review() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  const currentReview = reviews[currentReviewIndex];

  return (
    <div>
      <section className="review-container">
        <div className="button-container left">
          <button className="prev-btn" onClick={prevReview}>
            Previous
          </button>
        </div>

        <section className="review">
          <div className="img-container">
            <img
              src={currentReview["api.img"]}
              id="person-img"
              alt={currentReview["api.name"]}
            />
            <h4>{currentReview["api.name"]}</h4>
          </div>

          <p>"{currentReview["api.review"]}"</p>
        </section>

        <div className="button-container right">
          <button className="next-btn" onClick={nextReview}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default Review;
