import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import ToastContainer from "./utils/ToastContainer";
import { useLayoutEffect, useState } from "react";
import { isExpired } from "react-jwt";
import { SERVER_URL, AUTH_END_POINT } from "./utils/constants";
import { autoLogin, logout } from "./features/userSlice";
import Axios from "./api/Axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { initializeSocket } from "./features/socketSlice";

// Socket
const globalSocket = io(SERVER_URL);

function App() {
  const { user } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { token } = user;
  const dispatch = useDispatch();

  // geeting user data from local storage
  useLayoutEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!token) {
          return dispatch(logout());
        } else {
          const checkToken = isExpired(token);
          if (checkToken === true) {
            const { data } = await Axios.post(`${AUTH_END_POINT}/refreshtoken`);
            if (data) {
              dispatch(autoLogin(data));
              localStorage.setItem("token", data.user.token);
            }
          }
        }
      } catch (error) {
        dispatch(logout());
        toast.error("Session expired, Login again!.", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
      dispatch(initializeSocket(globalSocket));
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="dark">
      <ToastContainer />
      {/* <SocketContext.Provider value={globalSocket}> */}
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={token ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
      {/* </SocketContext.Provider> */}
    </div>
  );
}

export default App;
