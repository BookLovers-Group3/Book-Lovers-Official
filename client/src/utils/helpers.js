const calculateStatus = (count) => {
  if (count >= 50) {
    return "Book Lover";
  } else if (count >= 25) {
    return "Scholar";
  } else if (count >= 10) {
    return "Librarian";
  } else if (count >= 5) {
    return "Book Collector";
  } else if (count >= 1) {
    return "Bookworm";
  } else {
    return "Bookie";
  }
};

export default calculateStatus;
