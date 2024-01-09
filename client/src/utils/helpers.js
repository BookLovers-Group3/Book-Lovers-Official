const calculateStatus = (count) => {
  if (count >= 20) {
    return "Book Lover";
  } else if (count >= 15) {
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
