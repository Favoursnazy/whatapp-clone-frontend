import EmojiPickerApp from "./EmojiPicker";
import { Attachments } from "./attachments";
import Inputs from "./Inputs";
import { SendIcon } from "../../../svg";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToUser } from "../../../features/chatSlice";
import { ClipLoader } from "react-spinners";
import { FaMicrophone } from "react-icons/fa";
import VoiceRecord from "./attachments/menu/VoiceRecord";

const ChatActions = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [loading, setLoading] = useState(false);
  const txtRef = useRef();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.socket);
  const { token } = user;
  const values = {
    message,
    convo_id: activeConversation?._id,
    files: [],
    token,
  };
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newMessage = await dispatch(sendMessageToUser(values));
    socket.emit("send_message", newMessage.payload);
    setMessage("");
    setLoading(false);
  };
  return (
    <form
      onSubmit={(e) => sendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      {!showAudioRecorder ? (
        <div className="w-full flex items-center gap-x-2">
          {/* Emojis and attachment */}
          <ul className="flex gap-x-2">
            <EmojiPickerApp
              txtRef={txtRef}
              message={message}
              setMessage={setMessage}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              setShowAttachments={setShowAttachments}
            />
            <Attachments
              showAttachments={showAttachments}
              setShowAttachments={setShowAttachments}
              setShowPicker={setShowPicker}
            />
          </ul>
          {/* Input */}
          <Inputs message={message} setMessage={setMessage} txtRef={txtRef} />
          {/* Send Button */}
          {message.length > 0 ? (
            <button type="submit" className="btn">
              {status === loading && loading ? (
                <ClipLoader color="#E9EDEF" size={25} />
              ) : (
                <SendIcon className="dark:fill-dark_svg_1" />
              )}
            </button>
          ) : (
            <button className="btn" type="button">
              <FaMicrophone
                color="#E9EDEF"
                size={25}
                onClick={() => setShowAudioRecorder((prev) => !prev)}
              />
            </button>
          )}
        </div>
      ) : (
        <VoiceRecord setShowAudioRecorder={setShowAudioRecorder} />
      )}
      {/* Container */}
    </form>
  );
};

export default ChatActions;
