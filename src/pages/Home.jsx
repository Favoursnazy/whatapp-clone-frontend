import React, { useEffect, useState } from "react";
import { SideBar } from "../components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversation,
  updateMessageAndConversation,
} from "../features/chatSlice";
import { ChatContainer, WhatsappHome } from "../components/chat";
import SocketContext from "../context/SocketContext";
import {
  getChatUsername,
  getConversationId,
  getUserProfilePicture,
} from "../utils/chat";
import { addPeer, call_a_user } from "../features/callSlice";
import Peer from "peerjs";
import Ringing from "../components/chat/call/Ringing";

const Home = ({ socket }) => {
  const { user } = useSelector((state) => state.user);
  const { picture, name } = user;
  const { activeConversation } = useSelector((state) => state.chat);
  const { call, peerId } = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [show, setShow] = useState(false);

  // Typing
  const [typing, setTyping] = useState(false);

  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user.id);
    //get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Intializing PeerJs
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "/",
      port: "3001",
    });

    dispatch(addPeer(newPeer));
  }, [dispatch]);

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

  // Useffect for typing
  useEffect(() => {
    return () => {
      socket.on("typing", (conversation) => setTyping(conversation));
      socket.on("stop_typing", () => setTyping(false));
    };
  }, []);

  //Call useffect
  useEffect(() => {
    socket.on("callUserToClient", (data) => {
      dispatch(call_a_user(data));
    });

    return () => socket.off("callUserToClient");
  }, [dispatch, socket]);

  //call user function
  const caller = async ({ video }) => {
    setShow(true);
    const name = getChatUsername(user, activeConversation.users);
    const picture = getUserProfilePicture(user, activeConversation.users);
    const id = getConversationId(user, activeConversation.users);
    const msg = {
      sender: user.id,
      reciever: id,
      name,
      picture,
      video,
    };
    dispatch(call_a_user(msg));
  };

  const videoCall = () => {
    caller({ video: true });
    const msg = {
      sender: user.id,
      reciever: getConversationId(user, activeConversation.users),
      name,
      picture,
      video: true,
    };

    if (peerId.open) msg.peerId = peerId._id;

    socket.emit("CallUser", msg);
    setShow(true);
  };

  // Audi Call/Voice Call
  const audioCall = () => {
    caller({ video: false });
    const msg = {
      sender: user.id,
      reciever: getConversationId(user, activeConversation.users),
      name,
      picture,
      video: false,
    };

    if (peerId.open) msg.peerId = peerId._id;

    socket.emit("CallUser", msg);
    setShow(true);
  };

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/* Container */}
        <div className="container h-screen flex">
          {/* Sidebar */}
          <SideBar onlineUsers={onlineUsers} typing={typing} />
          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              typing={typing}
              callUser={videoCall}
              audioCall={audioCall}
            />
          ) : (
            <WhatsappHome />
          )}
        </div>
      </div>
      {call && <Ringing />}
    </>
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
