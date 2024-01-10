const calculateStatus = (count) => {
  if (count >= 50) {
    return "Book Lover";
  } else if (count >= 30) {
    return "Scholar";
  } else if (count >= 20) {
    return "Librarian";
  } else if (count >= 10) {
    return "Book Collector";
  } else if (count >= 1) {
    return "Bookworm";
  } else {
    return "Bookie";
  }
};

export default calculateStatus;
