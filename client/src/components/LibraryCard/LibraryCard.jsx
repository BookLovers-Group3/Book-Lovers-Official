import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import AvatarEditor from "react-avatar-editor";
import "./LibraryCard.scss";
import { UPDATE_PROFILE_IMAGE } from "../../utils/mutations";
const avatar = "../../images/InitialAvatar.jpg";
import BookList from "../BookList/BookList";
import FriendList from "../FriendList/FriendList";

import calculateStatus from "../../utils/helpers";

import Auth from "../../utils/auth";
import { QUERY_LEDGER } from "../../utils/queries";

const LibraryCard = ({ user, youAreTheirFriend }) => {
  const [isMe, setIsMe] = useState(
    user._id === Auth?.getProfile().data._id ? true : false
  );

  //check to see if user looking at page is current profile being viewed
  useEffect(() => {
    if (user._id === Auth?.getProfile().data._id) {
      setIsMe(true);
    }
  }, [user._id]);

  // get the user profile image
  const userImage = user?.profileImage;

  // if set uploaded image by default to the user profile image, if there is no user profile image, set it to avatar
  const [uploadedImage, setUploadedImage] = useState(
    userImage ? userImage : avatar
  );

  // mutation to updated the user profile image to the uploaded image
  const [addProfileImage, { error, data }] = useMutation(UPDATE_PROFILE_IMAGE, {
    refetchQueries: ["me"],
  });

  // get the favorite book list container, the lending book list container and the borrowed books container

  // define function to upload the image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setUploadedImage(reader.result);
        addProfileImage({
          variables: { image: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // define function to show favorite book list
  const showFavBooks = () => {
    const favBookEl = document.querySelector(".favBookList");
    const lendingBookEl = document.querySelector(".lendingBookList");
    const borrowedBookEl = document.querySelector(".borrowedBookList");
    const friendsEl = document.querySelector(".friendList");
    lendingBookEl.classList.add("hidden");
    borrowedBookEl.classList.add("hidden");
    friendsEl.classList.add("hidden");
    favBookEl.classList.remove("hidden");
  };

  // define function to show lending book list
  const showLendingBooks = () => {
    const favBookEl = document.querySelector(".favBookList");
    const lendingBookEl = document.querySelector(".lendingBookList");
    const borrowedBookEl = document.querySelector(".borrowedBookList");
    const friendsEl = document.querySelector(".friendList");
    borrowedBookEl.classList.add("hidden");
    favBookEl.classList.add("hidden");
    friendsEl.classList.add("hidden");
    lendingBookEl.classList.remove("hidden");
  };

  // define function to show borrowed book list
  const showBorrowedBooks = () => {
    const favBookEl = document.querySelector(".favBookList");
    const lendingBookEl = document.querySelector(".lendingBookList");
    const borrowedBookEl = document.querySelector(".borrowedBookList");
    const friendsEl = document.querySelector(".friendList");
    lendingBookEl.classList.add("hidden");
    favBookEl.classList.add("hidden");
    friendsEl.classList.add("hidden");
    borrowedBookEl.classList.remove("hidden");
  };

  // define function to show friend list
  const showFriends = () => {
    const favBookEl = document.querySelector(".favBookList");
    const lendingBookEl = document.querySelector(".lendingBookList");
    const borrowedBookEl = document.querySelector(".borrowedBookList");
    const friendsEl = document.querySelector(".friendList");
    console.log("show friends", user.friends);
    lendingBookEl.classList.add("hidden");
    favBookEl.classList.add("hidden");
    borrowedBookEl.classList.add("hidden");
    friendsEl.classList.remove("hidden");
  };

  const genreList = user.favoriteGenres.map((genre, index) => {
    return (
      <p className="list" key={index}>
        {genre}
      </p>
    );
  });

  const lookingForList = user.lookingFor.map((lookingFor, index) => {
    return (
      <p key={index} className="list">
        {lookingFor}
      </p>
    );
  });

  // query the ledger info
  const { loading, data: ledgerData } = useQuery(QUERY_LEDGER, {
    variables: { profileId: user._id },
  });

  const count = ledgerData?.getUserBookCount?.count ?? 0;

  // define state for the size
  const [editorSize, setEditorSize] = useState({
    width: 200,
    height: 200,
  });

  // define function for handlesizechange
  const handleSizeChange = () => {
    if (window.innerWidth < 768) {
      setEditorSize({ width: 100, height: 100 });
    } else {
      setEditorSize({ width: 200, height: 200 });
    }
  };

  // the hanndleSizeChange is the event basedon the medium article.
  window.addEventListener("resize", handleSizeChange);

  return (
    <>
      <div className="main-card">
        <div className="top-row">
          <h1>Book Lovers Library</h1>
          <h2 className="user-name">{user.name}</h2>
          <img
            className="status-icon"
            src={calculateStatus(count)}
            alt="image of status"
          />
        </div>
        <div className="user-profile">
          <div className="image-upload-container">
            <AvatarEditor
              image={uploadedImage}
              width={editorSize.width}
              height={editorSize.height}
              border={15}
              color={[255, 255, 255, 0.6]}
              scale={1.2}
              rotate={0}
              className="responsive-avatar"
            />

            {isMe ? (
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label">
                  Upload your picture!
                </label>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="user-details">
            <div className="list-title">
              Favorite Genres: <div className="genre-column">{genreList}</div>
            </div>
            <div className="list-title">I am looking for: {lookingForList}</div>
            <div className="list-title">
              Gender Identity: <p className="list"> {user.gender}</p>
            </div>
          </div>
        </div>

        <div className="user-list">
          <button className="" onClick={() => showFavBooks()}>
            Favorite Books
          </button>
          {isMe || youAreTheirFriend ? (
            <>
              <button className="" onClick={() => showLendingBooks()}>
                Checkout My Books
              </button>
              <button className="" onClick={() => showBorrowedBooks()}>
                Borrowed Books
              </button>
              <button className="" onClick={() => showFriends()}>
                Friends
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="hidden favBookList">
        <BookList books={user.favoriteBooks} isMe={isMe} type="favorite" />
      </div>
      <div className="hidden lendingBookList">
        <BookList books={user.booksToLend} isMe={isMe} type="lending" />
      </div>
      <div className="hidden borrowedBookList">
        <BookList books={user.booksBorrowed} isMe={isMe} type="borrowed" />
      </div>
      <div className="hidden friendList">
        <FriendList friends={user.friends} isMe={isMe} />
      </div>
    </>
  );
};

export default LibraryCard;
