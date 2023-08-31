import React from "react";
import { dateHandler } from "../../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatUsername,
  getConversationId,
  getUserProfilePicture,
} from "../../../utils/chat";
import {
  clearUnreadMessages,
  createConversation,
} from "../../../features/chatSlice";
import { capitalize } from "../../../utils/string";
import { lastestMessageConversation } from "../../../utils/conversation";
import MessageStatus from "../MessageStatus";

const Conversation = ({ convo, online, typing, setToggleMobile }) => {
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.socket);
  const { token } = user;
  const dispatch = useDispatch();

  // Values to sent to backend to create a new message
  const values = {
    reciever_id: convo.isGroup ? "group" : getConversationId(user, convo.users),
    isGroup: convo.isGroup ? convo._id : false,
    convo_id: convo._id ? convo._id : false,
    unreadMessages: convo.unreadMessages,
    token,
  };

  //Opening a new conversation between users
  const openConversation = async () => {
    const newConvo = await dispatch(createConversation(values));
    socket.emit("join_conversation", newConvo?.payload?._id);
    if (convo?.unreadMessages && convo?.unreadMessages > 0) {
      dispatch(clearUnreadMessages(convo?._id));
      socket.emit("updateRead", newConvo.payload);
    }
    sessionStorage.setItem("activeConvo", newConvo.payload._id);
    setToggleMobile(true);
  };

  // Getting a user profile picture
  const picture = convo.isGroup
    ? convo.picture
    : getUserProfilePicture(user, convo.users);

  // Getting the cuurent unique name
  const name = convo.isGroup
    ? convo.name
    : capitalize(getChatUsername(user, convo.users));

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
                <div className="flex flex-row items-center gap-1">
                  {convo?.latestMessage?.sender?._id === user.id &&
                    convo?.latestMessage?.status && (
                      <MessageStatus
                        messageStatus={convo?.latestMessage?.status}
                      />
                    )}
                  {typing === convo._id ? (
                    <p className="text-green_1 whitespace-nowrap">{`${name} is Typing`}</p>
                  ) : (
                    <p className="truncate whitespace-nowrap">
                      {lastestMessageConversation(convo?.latestMessage)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span
            className={`${
              convo.unreadMessages <= 0
                ? "dark:text-dark_text_2"
                : "text-[#00a884]"
            }`}
          >
            {convo.latestMessage?.createdAt
              ? dateHandler(convo.latestMessage?.createdAt)
              : ""}
          </span>
          {convo.unreadMessages > 0 && (
            <span className="bg-[#00a884] rounded-full text-sm px-[5px] flex items-center text-black">
              {convo.unreadMessages}
            </span>
          )}
        </div>
      </div>
      {/* Border*/}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

export default Conversation;
