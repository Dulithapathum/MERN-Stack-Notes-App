import "./App.css";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUP/SignUP";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="dashboard" element={<Home />}></Route>
          <Route path="login" element={<LogIn />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
