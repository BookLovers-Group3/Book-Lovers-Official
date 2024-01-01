import { useQuery } from "@apollo/client";
import { QUERY_BOOKS_LENDING } from "../../utils/queries";

export default function BookLendingListPage() {
  const { loading, data } = useQuery(QUERY_BOOKS_LENDING);
  if (loading) {
    return <div>Loading...</div>;
  }

  const list = data?.booksLending.map((book) => {
    return (
      <div key={book._id}>
        <p>
          {book.title}, {book.authors}
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
