import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_BOOK } from "../../utils/queries";
import { useParams } from "react-router-dom";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";

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

  console.log(book);
  if (!book?._id) {
    return <h4>No such book exist</h4>;
  }

  return (
    <>
      <div>
        <div>Title: {book.title}</div>
        <ModalBookDescription book={book} />
        <div>By: {book.authors}</div>
        <div>Posted by: This is the place-holder for bookowner</div>
        <img src={book.image} alt="" />
      </div>
      <div className="request-book-button">
        <button>Request to Borrow</button>
      </div>
    </>
  );
}
