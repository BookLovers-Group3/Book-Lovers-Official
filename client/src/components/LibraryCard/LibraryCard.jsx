import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import AvatarEditor from "react-avatar-editor";
import "./LibraryCard.scss";
import { UPDATE_PROFILE_IMAGE } from "../../utils/mutations";
const avatar = "../../images/InitialAvatar.jpg";
import BookList from "../BookList/BookList";
import FriendList from "../FriendList/FriendList";
import { Container, Col, Card, Row, Button } from "react-bootstrap";
import calculateStatus from "../../utils/helpers";
import { useParams } from "react-router-dom";
import { QUERY_LEDGER } from "../../utils/queries";

const LibraryCard = ({ user }) => {
  //if there is a profile Id, get it from the params
  // const { profileId } = useParams();
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

  const { loading, data: ledgerData } = useQuery(QUERY_LEDGER);
  console.log("ledger query", ledgerData);

  return (
    <>
      <div className="main-card">
        <div className="top-row">
          <h1>Book Lovers Library</h1>
          <h1 className="user-name">{user.name}</h1>
          <p className="status-icon">{calculateStatus()}</p>
        </div>
        <div className="user-profile">
          <div className="image-upload-container">
            <AvatarEditor
              image={uploadedImage}
              width={200}
              height={200}
              border={15}
              color={[255, 255, 255, 0.6]}
              scale={1.2}
              rotate={0}
            />
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                Click here to upload your picture!
              </label>
            </div>
          </div>
          <div>
            <div>Favorite Genres</div>
            <div>I am looking for:</div>
            <div>Gender Identity: {user.gender}</div>
          </div>
        </div>
        <div className="user-list">
          <Button className="btn-block btn-info" onClick={() => showFavBooks()}>
            Favorite Books
          </Button>
          <Button
            className="btn-block btn-info"
            onClick={() => showLendingBooks()}>
            Checkout My Books
          </Button>
          <Button
            className="btn-block btn-info"
            onClick={() => showBorrowedBooks()}>
            Borrowed Books
          </Button>
          <Button className="btn-block btn-info" onClick={() => showFriends()}>
            Friends
          </Button>
        </div>
      </div>
      <div className="hidden favBookList">
        <BookList books={user.favoriteBooks} type="favorite" />
      </div>
      <div className="hidden lendingBookList">
        <BookList books={user.booksToLend} type="lending" />
      </div>
      <div className="hidden borrowedBookList">
        <BookList books={user.booksBorrowed} type="borrowed" />
      </div>
      <div className="hidden friendList">
        <FriendList friends={user.friends} />
      </div>
    </>
  );
};

export default LibraryCard;
