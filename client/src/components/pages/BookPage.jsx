import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_BOOK } from "../../utils/queries";
import { useParams } from "react-router-dom";

export default function BookPage() {
  // get the bookId from the params
  const { bookId } = useParams();
  // manually setup the bookId here for test purpose
  const { loading: bookLoading, data: bookData } = useQuery(QUERY_SINGLE_BOOK, {
    variables: { bookId: bookId },
  });

  const book = bookData?.book;
  if (bookLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      BookPage
      <div>{book.title}</div>
    </div>
  );
}
