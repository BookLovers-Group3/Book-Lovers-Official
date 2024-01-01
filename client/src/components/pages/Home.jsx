import React, { useState, useEffect } from "react";
import { randomGoogleBooks } from "../../utils/API";
import RandomBook from "../RandomBook/RandomBooks";

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

      <div>
        <div>Review component here, can use props to do so here</div>
      </div>
    </main>
  );
};

export default Home;
