const calculateStatus = (count) => {
  if (count >= 50) {
    return "/images/book-lover.png";
  } else if (count >= 30) {
    return "/images/scholar.png";
  } else if (count >= 20) {
    return "/images/librarian.png";
  } else if (count >= 10) {
    return "/images/book-collector.png";
  } else if (count >= 1) {
    return "/images/bookworm.png";
  } else {
    return "/images/bookie.png";
  }
};

export default calculateStatus;
