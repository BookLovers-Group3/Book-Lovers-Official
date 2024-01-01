import "./LibraryCard.scss";

const LibraryCard = ({ user }) => {
  return (
    <div className="main-card">
      <div className="top-row">
        <h1>Book Lovers Library</h1>
        <h1>{user.name}</h1>
      </div>
      <div className="user-profile">
        <img src="#" alt="avatar" />
        <div>
          <div>Favorite Genres</div>
          <div>I am looking for:</div>
        </div>
      </div>
      <div className="user-list">
        <a href="#">Fav List</a>
        <a href="#">Checkout my books!</a>
        <a href="#">Borrowed Books</a>
      </div>
    </div>
  );
};

export default LibraryCard;
