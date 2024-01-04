import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { QUERY_BOOKS_LENDING } from "../../utils/queries";

export default function BookLendingListPage() {
  // query all books that are currently in lending state
  const { loading, data } = useQuery(QUERY_BOOKS_LENDING);
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(data);

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
            to={`/profile/${book.owner._id}`}
          >
            {book.owner.name}
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
