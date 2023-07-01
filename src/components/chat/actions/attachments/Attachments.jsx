import React from "react";
import { AttachmentIcon } from "../../../../svg";
import Menu from "./menu/Menu";

const Attachments = ({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) => {
  return (
    <li className="relative ">
      <button
        type="button"
        onClick={() => {
          setShowPicker(false);
          setShowAttachments(!showAttachments);
        }}
        className="btn"
      >
        <AttachmentIcon className="dark:fill-dark_svg_1" />
      </button>
      {/* Menu */}
      {showAttachments ? <Menu /> : null}
    </li>
  );
};

export default Attachments;
