import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";
import VoiceMessageFile from "./files/VoiceMessageFile";

const ChatMesages = ({ typing }) => {
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const endRef = useRef();
  const scrollToEnd = () => {
    endRef.current.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    scrollToEnd();
  }, [messages]);
  return (
    <div className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')] bg-cover bg-no-repeat">
      {/* container */}
      <div className="scrollbar overflow-scrollbar overflow-auto py-2 px-[5%]">
        {/* Messages */}
        {messages &&
          messages.map((message, i) => (
            <div key={i}>
              {/* messge files */}
              {message.files.length > 0
                ? message.files.map((file, i) => (
                    <FileMessage
                      message={message}
                      key={i}
                      me={user.id === message.sender._id}
                      fileMessage={file}
                    />
                  ))
                : null}
              {/* message text */}
              {message.message.length > 0 ? (
                <Message
                  message={message}
                  key={message._id}
                  me={user.id === message.sender._id}
                />
              ) : null}

              {message.voice ? (
                <VoiceMessageFile
                  message={message}
                  key={message._id}
                  me={user.id === message.sender._id}
                />
              ) : null}
            </div>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div ref={endRef}></div>
      </div>
    </div>
  );
};

export default ChatMesages;
