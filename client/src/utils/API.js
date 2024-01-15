const apiKey = import.meta.env.VITE_APP_API_KEY

export const searchGoogleBooks = (query) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
  );
};

const subjects = [
  "Art",
  "Bibles",
  "Computers",
  "Antiques+&+Collectibles",
  "ARCHITECTURE",
  "BODY+MIND+&+SPIRIT",
  "BUSINESS+&+ECONOMICS",
  "COMICS+&+GRAPHICNOVELS",
  "COOKING",
  "CRAFTS+&+HOBBIES",
  "DESIGN",
  "DRAMA",
  "EDUCATION",
  "FAMILY+&+RELATIONSHIPS",
  "FICTION",
  "FOREIGN+LANGUAGE+STUDY",
  "GAMES+&+ACTIVITIES",
  "GARDENING",
  "HEALTH & FITNESS",
  "HISTORY",
  "HOUSE+&+HOME",
  "HUMOR",
  "JUVENILE+FICTION",
  "JUVENILE+NONFICTION",
  "LANGUAGE+ARTS+&+DISCIPLINES",
  "LAW",
  "LITERARY+COLLECTIONS",
  "LITERARY+CRITICISM",
  "MATHEMATICS",
  "MEDICAL",
  "MUSIC",
  "NATURE",
  "PERFORMING+ARTS",
  "PETS",
  "PHILOSOPHY",
  "PHOTOGRAPHY",
  "POETRY",
  "POLITICAL+SCIENCE",
  "PSYCHOLOGY",
  "REFERENCE",
  "RELIGION",
  "SCIENCE",
  "SELF-HELP",
  "SOCIAL+SCIENCE",
  "SPORTS+&+RECREATION",
  "STUDY AIDS",
  "TECHNOLOGY+&+ENGINEERING",
  "TRANSPORTATION",
  "TRAVEL",
  "TRUE+CRIME",
  "YOUNG+ADULT+FICTION",
  "YOUNG+ADULT+NONFICTION",
];

export const randomGoogleBooks = async () => {
  const randomIndex = Math.floor(Math.random() * subjects.length);
  const randomSubject = subjects[randomIndex];

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${randomSubject}&key=${apiKey}`
  );
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const randomBookIndex = Math.floor(Math.random() * data.items.length);

    return data.items[randomBookIndex];
  } else {
    return null;
  }
};
