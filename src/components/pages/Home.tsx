import { useEffect } from "react";
import { useSelector } from "../../predux/store";
import { selectUser } from "../../predux/user/user.selectors";
import { db } from "../../utils/firebase";
import Editor from "./Editor";

const Home = () => {
  // const user = useSelector(selectUser);

  // useEffect(() => {
  //   if (user) {
  //     const ref = db.ref(`docs/${user.uid}`);
  //     ref.once("value").then((data) => console.log(data));
  //   }
  // }, [user]);
  return (
    <div>
      <Editor />
    </div>
  );
};

export default Home;
