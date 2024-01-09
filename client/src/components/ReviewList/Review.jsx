import { useState } from "react";
import reviews from "../../utils/Reviews";

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
      <section className="container">
        <div className="title">
          <h2>Our Reviews</h2>
          <div className="underline"></div>
        </div>

        <article className="review">
          <div className="img-container">
            <img
              src={currentReview["api.img"]}
              id="person-img"
              alt={currentReview["api.name"]}
            />
          </div>
          <h4>{currentReview["api.name"]}</h4>
          <p>"{currentReview["api.review"]}"</p>
          <div className="button-container">
            <button className="prev-btn" onClick={prevReview}>
              Previous
            </button>
            <button className="next-btn" onClick={nextReview}>
              Next
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Review;
