import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../../../features/chatSlice";
import SocketContext from "../../../context/SocketContext";

const Contact = ({ contact, setSearchResults, socket }) => {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const values = {
    reciever_id: contact._id,
    token,
  };
  const openConversation = async () => {
    const newConvo = await dispatch(createConversation(values));
    setSearchResults([]);
    socket.emit("join_conversation", newConvo.payload._id);
  };
  return (
    <li
      onClick={() => openConversation()}
      className="list-none h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]"
    >
      {/* container */}
      <div className="flex items-center gap-x-3 py-[10px]">
        {/*Contact Info  */}
        <div className="flex items-center gap-x-3">
          {/* Converstion picture */}
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={contact?.picture}
              alt={contact?.name}
              className="w-full h-full objext-cover"
            />
          </div>
          {/* converstaion name and message */}
          <div className="w-full flex flex-col">
            {/* Converstion name */}
            <h1 className="font-bold flex items-center gap-x-2">
              {contact?.name}
            </h1>
            {/* Conversation status */}
            <div className="flex items-center gap-x-1 dark:text-dark_text_2">
              <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                {contact.status}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Border*/}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
