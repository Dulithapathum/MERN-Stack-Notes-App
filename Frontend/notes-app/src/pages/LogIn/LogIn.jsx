import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import NavBar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import validateEmail from "../../utils/helper";
const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [error, setError] = useState(null);

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please Enter Valid Email Adderess.");
      return;
    }

if(!password){
  setError("Please Enter The Password")
  return
}

    setError("")

    // Login Api Call
  };

  return (
    <div>
      <NavBar />
      <div className=" flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogIn}>
            <h4 className="text-2xl mb-7 text-center">LogIn</h4>
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
              LogIn
            </button>
            <p className="text-sm text-center mt-4">
              Not Rejister Yet?
              <Link to="/signup" className="font-medium text-primary underline">
                Create An Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
