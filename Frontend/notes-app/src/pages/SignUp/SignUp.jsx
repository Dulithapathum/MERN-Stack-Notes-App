import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import NavBar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import validateEmail from "../../utils/helper";
const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [error, setError] = useState(null);

  const handleSigUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please Enter Your Name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please Enter Valid Email Adderess.");
      return;
    }

    if (!password) {
      setError("Please Enter The Password");
      return;
    }

    setError("");

    // SignUp API Call
  };
 
  return (
    <div>
      <NavBar />
      <div className=" flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSigUp}>
            <h4 className="text-2xl mb-7 text-center">SignUp</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassowrd(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Create An Account
            </button>
            <p className="text-sm text-center mt-4">
              Already Have An Account?
              <Link to="/login" className="font-medium text-primary underline">
                LogIn
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
