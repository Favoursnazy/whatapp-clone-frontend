import React from "react";
import { BsCheck2All } from "react-icons/bs";

function MessageStatus({ messageStatus }) {
  return (
    <>
      {messageStatus === "sent" && <BsCheck2All className="text-lg" />}
      {messageStatus === "read" && <BsCheck2All className="text-icon_ack" />}
    </>
  );
}

export default MessageStatus;
