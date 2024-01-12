import React from "react";
import { FAV_BOOK } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { Button } from "react-bootstrap";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";
import Auth from "../../utils/auth";

const RandomBooks = ({ randomBook }) => {
  // sets up mutation to add book to favorites list
  const [
    addBook,
    { loading: favBookLoading, data: favBookData, error: favBookError },
  ] = useMutation(FAV_BOOK, {
    refetchQueries: ["me"],
  });

  // on button press, takes in book data and creates book in database then adds to user's favorite list
  const handleFavBook = async (randomBook) => {
    const bookToFavorite = {
      googleBookId: randomBook.id,
      authors: randomBook.volumeInfo.authors,
      description: randomBook.volumeInfo.description,
      image: randomBook.volumeInfo.imageLinks.thumbnail,
      title: randomBook.volumeInfo.title,
    };
    console.log("booktofavorite: ", bookToFavorite);

    try {
      const response = await addBook({
        variables: { book: bookToFavorite },
      });
      console.log("response: ", response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {randomBook ? (
        <section className="random-book-container">
          <div className="random-card">
            <div>
              <img
                src={
                  randomBook.volumeInfo.imageLinks?.thumbnail ||
                  "No image available"
                }
                alt={`book cover for ${randomBook.volumeInfo.title}`}
              />
              <p>
                {randomBook.volumeInfo.authors?.join(", ") || "author unknown"}
              </p>
            </div>
            <h4> {randomBook.volumeInfo.title}</h4>
          </div>
          <ModalBookDescription randomBook={randomBook} />
          <div>
            {randomBook.saleInfo.isEbook ? (
              <a className="custom-e-book" href={randomBook.saleInfo.buyLink} target="_blank">
                Buy it as an eBook!
              </a>
            ) : null}
          </div>
          <div>
            {Auth.loggedIn() && (
              <Button
                className="btn-block btn-info"
                onClick={() => handleFavBook(randomBook)}>
                Favorite
              </Button>
            )}
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomBooks;
