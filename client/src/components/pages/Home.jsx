import React, { useState, useEffect } from "react";
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
      <div>
        <div>
          <h2>Featured Book</h2>
          {randomBook ? (
            <RandomBook randomBook={randomBook} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <Review />
    </main>
  );
};

export default Home;
