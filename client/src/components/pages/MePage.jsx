import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries";

export default function MePage() {
  const { loading, data } = useQuery(QUERY_ME);
  const user = data.me;
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      MePage
      <div>Welcome back! {user.name}</div>
    </div>
  );
}
