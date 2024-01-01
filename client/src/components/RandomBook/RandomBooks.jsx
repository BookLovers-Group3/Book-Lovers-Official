import React from "react";

const RandomBooks = ({ randomBook }) => {
  return (
    <div>
      {randomBook ? (
        <section className="random-book-container">
          <div>
            <img
              src={randomBook.volumeInfo.imageLinks.thumbnail}
              alt={`book cover for ${randomBook.volumeInfo.title}`}
            />
            <h3> {randomBook.volumeInfo.title}</h3>
            <p>{randomBook.volumeInfo.authors}</p>
          </div>
          <div>
            <p>{randomBook.volumeInfo.description}</p>
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomBooks;
