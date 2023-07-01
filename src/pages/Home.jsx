import React, { useEffect, useState } from "react";
import { SideBar } from "../components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversation,
  updateMessageAndConversation,
} from "../features/chatSlice";
import { ChatContainer, WhatsappHome } from "../components/chat";
import SocketContext from "../context/SocketContext";

const Home = ({ socket }) => {
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [typing, setTyping] = useState(false);
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);

  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user.id);
    //get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //get converstions
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user]);

  //listening to recieved message
  useEffect(() => {
    return () =>
      socket.on("recieved_message", (message) => {
        dispatch(updateMessageAndConversation(message));
      });
  }, []);

  useEffect(() => {
    return () => {
      socket.on("typing", (conversation) => setTyping(conversation));
      socket.on("stop_typing", () => setTyping(false));
    };
  });

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="container h-screen flex">
        {/* Sidebar */}
        <SideBar onlineUsers={onlineUsers} typing={typing} />
        {activeConversation._id ? (
          <ChatContainer onlineUsers={onlineUsers} typing={typing} />
        ) : (
          <WhatsappHome />
        )}
      </div>
    </div>
  );
};

const HomeWithSocket = (props) => {
  return (
    <SocketContext.Consumer>
      {(socket) => <Home {...props} socket={socket} />}
    </SocketContext.Consumer>
  );
};

export default HomeWithSocket;
