import React from "react";

const RandomBooks = ({ randomBook }) => {
  return (
    <div>
      {randomBook ? (
        <section className="random-book-container">
          <div>
            <img
              src={
                randomBook.volumeInfo.imageLinks.thumbnail ||
                "No image available"
              }
              alt={`book cover for ${randomBook.volumeInfo.title}`}
            />
            <h3> {randomBook.volumeInfo.title}</h3>
            <p>
              {randomBook.volumeInfo.authors?.join(", ") || "author unknown"}
            </p>
          </div>
          <div>
            <p>
              {randomBook.volumeInfo.description || "No description available"}{" "}
            </p>
            {randomBook.saleInfo.isEbook ? (
              <a href={randomBook.saleInfo.buyLink} target="_blank">
                Buy it as an eBook!
              </a>
            ) : null}
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomBooks;
