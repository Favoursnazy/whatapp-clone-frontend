import React from "react";
import { dateHandler } from "../../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatUsername,
  getConversationId,
  getUserProfilePicture,
} from "../../../utils/chat";
import { createConversation } from "../../../features/chatSlice";
import SocketContext from "../../../context/SocketContext";

const Conversation = ({ convo, socket, online, typing }) => {
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { token } = user;
  const dispatch = useDispatch();
  const values = {
    reciever_id: getConversationId(user, convo.users),
    token,
  };
  const openConversation = async () => {
    const newConvo = await dispatch(createConversation(values));
    socket.emit("join_conversation", newConvo.payload._id);
  };
  const picture = getUserProfilePicture(user, convo.users);
  const name = getChatUsername(user, convo.users);
  return (
    <li
      onClick={() => openConversation()}
      className={`list-none h-[72px] wfull dark:bg-dark_bg_1 hover:${
        convo._id === activeConversation._id ? "" : "dark:bg-dark_bg_2"
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        convo._id === activeConversation._id ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      {/* Container */}
      <div className="relative w-full flex items-center justify-between py-[10px]">
        {/* left */}
        <div className="flex items-center gap-x-3">
          {/* Converstion picture */}
          <div
            className={` ${
              online ? "online" : ""
            } relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden`}
          >
            <img
              src={picture}
              alt={convo?.name}
              className="w-full h-full objext-cover"
            />
          </div>
          {/* converstaion name and message */}
          <div className="w-full flex flex-col">
            {/* Converstion name */}
            <h1 className="font-bold flex items-center gap-x-2">{name}</h1>
            {/* Conversation message */}
            <div className="flex items-center gap-x-1 dark:text-dark_text_2">
              <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                {typing === convo._id ? (
                  <p className="text-green_1">{`${name} is Typing`}</p>
                ) : (
                  <p>
                    {convo?.latestMessage?.message.length > 35
                      ? `${convo?.latestMessage?.message.substring(0, 35)}...`
                      : convo?.latestMessage?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {convo.latestMessage?.createdAt
              ? dateHandler(convo.latestMessage?.createdAt)
              : ""}
          </span>
        </div>
      </div>
      {/* Border*/}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

const ConversationWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ConversationWithContext;
