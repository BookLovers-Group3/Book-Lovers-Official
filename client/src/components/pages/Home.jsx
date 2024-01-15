import { useState, useEffect } from "react";
import { randomGoogleBooks } from "../../utils/API";
import RandomBook from "../RandomBook/RandomBooks";
import Review from "../ReviewList/Review";

const Home = () => {
  const [randomBook, setRandomBook] = useState(null);

  useEffect(() => {
    const fetchRandomBook = async () => {
      const book = await randomGoogleBooks();
      setRandomBook(book);
    };

    fetchRandomBook();
  }, []);

  return (
    <main>
      <div className="book-spotlight">
        <h2>Book Spotlight</h2>
        {randomBook ? (
          <RandomBook randomBook={randomBook} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Review />
    </main>
  );
};

export default Home;
