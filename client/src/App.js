import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { UserContext } from "./context/userContext";
import { API, setAuthToken } from "./config/api";

import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import EditProfile from "./pages/EditProfile";
import AddRoute from "./pages/AddRoute";
import EditRoute from "./pages/EditRoute";
import ChangePassword from "./pages/ChangePassword";

// Init token on axios every time the app is refreshed here ...
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/add-route" element={<AddRoute />} />
        <Route path="/edit-route/:id" element={<EditRoute />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
