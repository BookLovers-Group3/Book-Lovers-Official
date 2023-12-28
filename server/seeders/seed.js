const db = require("../config/connection");
const { Profile, Book } = require("../models");
const profileSeeds = require("./profileSeeds.json");
const bookSeeds = require("./bookSeeds.json");
const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    await cleanDB("Profile", "profiles");

    await Profile.create(profileSeeds);
    await Book.create(bookSeeds);

    console.log("all done!");
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
