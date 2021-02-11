import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Editor from "./components/pages/Editor";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Viewer from "./components/pages/Viewer";
import Spinner from "./components/Spinner";
import { useDispatch, useSelector } from "./predux/store";
import { signInSuccess } from "./predux/user/user.actions";
import { selectUser } from "./predux/user/user.selectors";
import { auth } from "./utils/firebase";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(signInSuccess(user));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Spinner />;
  return (
    <main className="App">
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/editor/:documentId">
          <Editor />
        </Route>
        <Route path="/:userId/:documentId">
          <Viewer />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
