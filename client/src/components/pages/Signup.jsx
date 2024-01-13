import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PROFILE } from "../../utils/mutations";

import Auth from "../../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    status: "Bookie",
    favoriteGenres: [],
    lookingFor: [],
  });
  const [addProfile, { error, data }] = useMutation(ADD_PROFILE);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(value);

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // update state based on form input changes for the favorite genres and lookingFor
  const handleChangeArr = (event) => {
    const { name, value, checked } = event.target;
    console.log(value);
    if (checked) {
      setFormState({
        ...formState,
        [name]: [...formState[name], value],
      });
    } else {
      setFormState(() => ({
        ...formState,
        [name]: formState[name].filter((item) => item !== value),
      }));
    }
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addProfile({
        variables: { ...formState },
      });

      Auth.login(data.addProfile.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="account-container">
      <div className="account-background">
        <h4>Sign Up</h4>
        <div className="custom-card-body">
          {data ? (
            <p>
              Success! You may now head{" "}
              <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <form className="custom-form" onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your username"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
              <select
                className="form-input"
                placeholder="******"
                name="gender"
                type="gender"
                value={formState.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Nonbinary">Nonbinary</option>
                <option value="Bigender">Bigender</option>
                <option value="Agender">Agender</option>
                <option value="Genderqueer">Genderqueer</option>
                <option value="Ask me!">Ask me!</option>
              </select>
              <div className = "form-genre">
                <p>Select your favorite genres</p>
                <div className = "genre-options"></div>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Fiction"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Fiction">Fiction</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Mystery"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Mystery">Mystery</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="History"
                  onChange={handleChangeArr}
                />
                <label htmlFor="History">History</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Biography"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Biography">Biography</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Thriller"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Thriller">Thriller</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Fantasy"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Fantasy">Fantasy</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Romance"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Romance">Romance</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="True Crime"
                  onChange={handleChangeArr}
                />
                <label htmlFor="True Crime">True Crime</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Education"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Education">Education</label>
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value="Other"
                  onChange={handleChangeArr}
                />
                <label htmlFor="Other">Other</label>
              </div>
              <div>
                <p>What are you looking for </p>
                <input
                  type="checkbox"
                  name="lookingFor"
                  value="I am just here to read"
                  onChange={handleChangeArr}
                />
                <label htmlFor="I am just here to read">
                  I am just here to read
                </label>
                <input
                  type="checkbox"
                  name="lookingFor"
                  value="I am looking for book buddies"
                  onChange={handleChangeArr}
                />
                <label htmlFor="I am looking for book buddies">
                  I am looking for book buddies
                </label>
                <input
                  type="checkbox"
                  name="lookingFor"
                  value="I am looking for book lovers"
                  onChange={handleChangeArr}
                />
                <label htmlFor="I am looking for book lovers">
                  I am looking for book lovers
                </label>
              </div>
              <button
                className="btn btn-block btn-info"
                style={{ cursor: "pointer" }}
                type="submit"
              >
                Submit
              </button>
            </form>
          )}

          {error && (
            <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Signup;
