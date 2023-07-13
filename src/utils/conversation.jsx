import { FaCamera, FaMicrophone } from "react-icons/fa";

export const lastestMessageConversation = (message) => {
  if (message.message.length > 35) {
    return `${message.message.substring(0, 35)}...`;
  }

  if (message.message) {
    return message.message;
  }

  if (message.files.length > 0) {
    return (
      <span className="flex gap-1 items-center">
        <FaCamera className="" />
        image
      </span>
    );
  }

  if (message.voice) {
    return (
      <span className="flex gap-1 items-center">
        <FaMicrophone className="" />
        Audio
      </span>
    );
  }
};
