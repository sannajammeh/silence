import Button from "antd/lib/button";
import Title from "antd/lib/typography/Title";
import { signInWithGoogle } from "../../utils/firebase";

const Login = () => {
  return (
    <div
      className="container"
      style={{ paddingTop: "2rem", textAlign: "center" }}
    >
      <Title style={{ textAlign: "center" }}>Login</Title>
      <Button
        onClick={() => signInWithGoogle()}
        type="primary"
        size="large"
        style={{ margin: "0 auto" }}
      >
        Sign up with Google
      </Button>
    </div>
  );
};

export default Login;
