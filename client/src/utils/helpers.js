const calculateStatus = (favoriteBooks, booksLent, booksBorrowed) => {
  switch (true) {
    case favoriteBooks.length === 0 &&
      booksLent.length === 0 &&
      booksBorrowed.length === 0:
      return "Bookie";
    case favoriteBooks.length >= 1 &&
      booksLent.length === 0 &&
      booksBorrowed.length === 0:
      return "Bookworm";
    case favoriteBooks.length >= 5 &&
      booksLent.length === 0 &&
      booksBorrowed.length >= 5:
      return "Book Collector";
    case favoriteBooks.length >= 5 &&
      booksLent.length >= 5 &&
      booksBorrowed.length >= 5:
      return "Librarian";
    case favoriteBooks.length >= 10 &&
      booksLent.length >= 7 &&
      booksBorrowed.length >= 7:
      return "Scholar";
    default:
      return "Book Lover";
  }
};

export default calculateStatus;
