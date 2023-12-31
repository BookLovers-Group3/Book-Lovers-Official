import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./components/pages/Home";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import ErrorPage from "./components/pages/ErrorPage";
import BuildBookList from "./components/pages/SearchPage.jsx";
import MePage from "./components/pages/MePage.jsx";
import ProfilePage from "./components/pages/MePage.jsx";
import BookPage from "./components/pages/BookPage.jsx";
import BookLendingListPage from "./components/pages/BookLendingListPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/build-book-list",
        element: <BuildBookList />,
      },
      {
        path: "/me",
        element: <MePage />,
      },
      {
        path: "profile/:profileId",
        element: <ProfilePage />,
      },
      {
        path: "book/:bookId",
        element: <BookPage />,
      },
      {
        path: "book-lending-list",
        element: <BookLendingListPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
