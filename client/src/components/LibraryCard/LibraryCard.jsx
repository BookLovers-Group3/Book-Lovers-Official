import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import AvatarEditor from "react-avatar-editor";
import "./LibraryCard.scss";
import { UPDATE_PROFILE_IMAGE } from "../../utils/mutations";
const avatar = "../../images/InitialAvatar.jpg";

const LibraryCard = ({ user }) => {
  const userImage = user.profileImage;
  const [uploadedImage, setUploadedImage] = useState(
    userImage ? userImage : avatar
  );
  const [addProfileImage, { error, data }] = useMutation(UPDATE_PROFILE_IMAGE, {
    refetchQueries: ["me"],
  });

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

  return (
    <div className="main-card">
      <div className="top-row">
        <h1>Book Lovers Library</h1>
        <h1>{user.name}</h1>
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
