import { useDispatch, useSelector } from "react-redux";
import Add from "./Add";
import { CloseIcon, SendIcon } from "../../../../svg";
import { uploadFiles } from "../../../../utils/uploadFiles";
import { useState } from "react";
import {
  clearFiles,
  removeFileFromFiles,
  sendMessageToUser,
} from "../../../../features/chatSlice";
import { ClipLoader } from "react-spinners";
import VideoThumbnail from "react-video-thumbnail";

const HandleAndSend = ({ setActiveIndex, activeIndex, message }) => {
  const { files, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { token } = user;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //Send message Handler
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    //upload files first
    const uploaded_files = await uploadFiles(files);
    //send the message
    const values = {
      token,
      message,
      convo_id: activeConversation?._id,
      files: uploaded_files.length > 0 ? uploaded_files : [],
    };
    let newMsg = await dispatch(sendMessageToUser(values));
    socket.emit("send_message", newMsg.payload);
    setLoading(false);
    dispatch(clearFiles());
  };

  // Remove file from state Handler
  const handleRemoveFile = (index) => {
    dispatch(removeFileFromFiles(index));
  };

  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      {/* Empty */}
      <span></span>
      {/* list files */}
      <div className="flex items-center gap-x-2">
        {files.map((file, i) => {
          return (
            <div
              onClick={() => setActiveIndex(i)}
              className={`file-thumbnail relative w-14 h-14 border mt-2 dark:border-white rounded-md overflow-hidden cursor-pointer  ${
                activeIndex === i ? "border-[3px] !border-green_1" : ""
              }`}
              key={i}
            >
              {file.type === "IMAGE" ? (
                <img
                  src={file.imgData}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : file.type === "VIDEO" ? (
                <VideoThumbnail videoUrl={file.imgData} />
              ) : (
                <img
                  src={`../../../../images/files/${file.type}.png`}
                  className="w-8 h-10 mt-1.5 ml-2.5"
                  alt=""
                />
              )}
              {/* remove file icon */}
              <div
                className="remove-file-icon hidden"
                onClick={() => handleRemoveFile(i)}
              >
                <CloseIcon className="dark:fill-white absolute right-0 top-0 h-4 w-4" />
              </div>
            </div>
          );
        })}
        {/* Add another file */}
        <Add setActiveIndex={setActiveIndex} />
      </div>
      {/* Send button */}
      <div
        onClick={(e) => sendMessageHandler(e)}
        className="bg-green_1 w-16 h-16 rounded-full mt-2 flex justify-center items-center cursor-pointer"
      >
        {loading ? (
          <ClipLoader color="#E9EDEF" size={25} />
        ) : (
          <SendIcon className="fill-white" />
        )}
      </div>
    </div>
  );
};

export default HandleAndSend;
