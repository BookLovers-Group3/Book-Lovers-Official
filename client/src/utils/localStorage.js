export const getFavBookIds = () => {
  const favBookIds = localStorage.getItem("favorited_books")
    ? JSON.parse(localStorage.getItem("favorited_books"))
    : [];

  return favBookIds;
};

export const favoritedBookIds = (bookIdArr) => {
  if (bookIdArr?.length) {
    localStorage.setItem("favorited_books", JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem("favorited_books");
  }
};

export const removeFavBookId = (googleBookId) => {
  const favoritedBookIds = localStorage.getItem("favorited_books")
    ? JSON.parse(localStorage.getItem("favorited_books"))
    : null;

  if (!favoritedBookIds) {
    return false;
  }

  const updatedFavoritedBookIds = favoritedBookIds?.filter(
    (favoritedBookId) => favoritedBookId !== googleBookId
  );
  localStorage.setItem(
    "favorited_books",
    JSON.stringify(updatedFavoritedBookIds)
  );

  return true;
};
