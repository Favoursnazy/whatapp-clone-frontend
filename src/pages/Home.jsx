import React, { useCallback, useEffect, useState } from "react";
import { SideBar } from "../components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversation,
  updateActiveConvoMessage,
  updateMessageAndConversation,
  updateReadMessage,
} from "../features/chatSlice";
import { ChatContainer, WhatsappHome } from "../components/chat";
import {
  getChatUsername,
  getConversationId,
  getUserProfilePicture,
} from "../utils/chat";
import { addPeer, call_a_user } from "../features/callSlice";
import Peer from "peerjs";
import Ringing from "../components/chat/call/Ringing";
import { useLayoutEffect } from "react";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { picture, name } = user;
  const { socket } = useSelector((state) => state.socket);
  const { activeConversation } = useSelector((state) => state.chat);
  const { call, peerId } = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [toggleMobile, setToggleMobile] = useState(false);

  // Typing
  const [typing, setTyping] = useState(false);

  // read message of active chat
  useEffect(() => {
    socket.on("user_read_message", (message) => {
      dispatch(updateActiveConvoMessage(message));
    });

    return () => socket.off("user_read_message");
  }, [socket, dispatch]);

  //join user into the socket io
  useEffect(() => {
    if (socket !== null) {
      socket.emit("join", user.id);
      //get online users
      socket.on("get-online-users", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user, socket]);

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

  const messageToUser = useCallback(async () => {
    socket.on("recieved_message", async (message) => {
      const activeConvo = sessionStorage.getItem("activeConvo");
      if (activeConvo && activeConvo === message.newMessage.conversation._id) {
        socket.emit("update_read_message", message.newMessage);
        dispatch(updateMessageAndConversation(message));
      } else if (
        activeConvo &&
        activeConvo !== message.newMessage.conversation._id
      ) {
        dispatch(updateMessageAndConversation(message));
      } else if (activeConvo === null) {
        dispatch(updateMessageAndConversation(message));
      }
    });
  }, [socket, dispatch]);

  //listening to recieved message
  useLayoutEffect(() => {
    messageToUser();
  }, [messageToUser]);

  // Useffect for typing
  useEffect(() => {
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop_typing", () => setTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket]);

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

  // Video call
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

  // Audio Call/Voice Call
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

  // socket connect error
  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [socket]);

  // recieve read message
  useEffect(() => {
    socket.on("recieved_read", (payload) => {
      dispatch(updateReadMessage(payload));
    });

    return () => socket.off("recieved_read");
  }, [socket, dispatch]);

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/* Container */}
        <div className="lg:container max-md:Mdcontainer sm:Mdcontainer h-screen flex">
          {/* Sidebar */}
          <SideBar
            onlineUsers={onlineUsers}
            typing={typing}
            toggleMobile={toggleMobile}
            setToggleMobile={setToggleMobile}
          />
          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              typing={typing}
              callUser={videoCall}
              audioCall={audioCall}
              toggleMobile={toggleMobile}
              setToggleMobile={setToggleMobile}
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

export default Home;
