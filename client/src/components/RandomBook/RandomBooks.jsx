import { useState } from "react";
import { FAV_BOOK } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";
import Auth from "../../utils/auth";
import { HeartFilled } from "@ant-design/icons";

const RandomBooks = ({ randomBook }) => {
  // sets up mutation to add book to favorites list
  const [
    addBook,
    { loading: favBookLoading, data: favBookData, error: favBookError },
  ] = useMutation(FAV_BOOK, {
    refetchQueries: ["me"],
  });

  const [buttonText, setButtonText] = useState("Add to Favorites");
  console.log("Before button click", buttonText);

  const handleButtonClick = () => {
    if (buttonText === "Add to Favorites") {
      setButtonText("Favorite Added!");
    }
  };

  console.log("After button click", buttonText);
  // on button press, takes in book data and creates book in database then adds to user's favorite list
  const handleFavBook = async (randomBook) => {
    const bookToFavorite = {
      googleBookId: randomBook.id,
      authors: randomBook.volumeInfo.authors,
      description: randomBook.volumeInfo.description,
      image: randomBook.volumeInfo.imageLinks.thumbnail,
      title: randomBook.volumeInfo.title,
    };
    // console.log("booktofavorite: ", bookToFavorite);

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
          <div>
            {Auth.loggedIn() && (
              <>
                <button
                  className="btn-favorite-rdm"
                  onClick={() => {
                    handleFavBook(randomBook);
                    handleButtonClick();
                  }}
                  disabled={buttonText === "Favorite Added!" ? true : false}
                >
                  {buttonText === "Favorite Added!" ? (
                    <HeartFilled
                      style={{ paddingBottom: "3px", marginRight: "4px" }}
                    />
                  ) : null}
                  {buttonText}
                </button>
                <div>
                  {randomBook.saleInfo.isEbook ? (
                    <a
                      className="custom-e-book"
                      href={randomBook.saleInfo.buyLink}
                      target="_blank"
                    >
                      Buy it as an eBook!
                    </a>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="random-card">
            <div>
              <img
                src={
                  randomBook.volumeInfo.imageLinks?.thumbnail ||
                  "No image available"
                }
                alt={`book cover for ${randomBook.volumeInfo.title}`}
              />
              <h4> {randomBook.volumeInfo.title}</h4>
              <p>
                {randomBook.volumeInfo.authors?.join(", ") || "author unknown"}
              </p>
            </div>
          </div>

          <div className="btn-container-random">
            <ModalBookDescription randomBook={randomBook} />
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomBooks;
