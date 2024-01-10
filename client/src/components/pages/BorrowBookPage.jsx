import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { QUERY_BOOKS_LENDING } from "../../utils/queries";
import { useEffect } from "react";
import Auth from "../../utils/auth";
import { Navigate } from "react-router-dom";

export default function BookLendingListPage() {
  // query all books that are currently in lending state
  const { loading, data, refetch } = useQuery(QUERY_BOOKS_LENDING, {
    fetchPolicy: "no-cache",
  });

  // Refetch the data when it changes
  useEffect(() => {
    refetch();
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(data);

  // if not logged in, go to the homepage
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  const list = data?.booksLending.map((book) => {
    return (
      <div key={book._id}>
        <p>
          <Link className="btn btn-lg btn-primary" to={`/book/${book._id}`}>
            {book.title}
          </Link>
          {book.authors}
          <Link
            className="btn btn-lg btn-primary"
            to={`/profile/${book.owner?._id}`}
          >
            {book.owner?.name}
          </Link>
        </p>
      </div>
    );
  });
  return (
    <div>
      Book Lending List Page
      <div>{list}</div>
    </div>
  );
}
