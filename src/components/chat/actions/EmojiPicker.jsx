import React, { useState } from "react";
import { CloseIcon, EmojiIcon } from "../../../svg";
import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";

const EmojiPickerApp = ({
  txtRef,
  message,
  setMessage,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) => {
  const [cursorPostion, setCursorPostion] = useState();
  useEffect(() => {
    txtRef.current.selectionEnd = cursorPostion;
  }, [cursorPostion]);

  const handleEmojis = (emojiData, e) => {
    const { emoji } = emojiData;
    const ref = txtRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setMessage(newText);
    setCursorPostion(start.length + emoji.length);
  };
  return (
    <li>
      <button
        className="btn"
        type="button"
        onClick={() => {
          setShowAttachments(false);
          setShowPicker(!showPicker);
        }}
      >
        {showPicker ? (
          <CloseIcon className="dark:fill-dark_svg_1" />
        ) : (
          <EmojiIcon className="dark:fill-dark_svg_1" />
        )}
      </button>
      {/* Emoji Picker */}
      {showPicker ? (
        <div className="openEmojiAnimation absolute bottom-[60px] left-[-0.5px] w-full">
          <EmojiPicker theme="dark" onEmojiClick={handleEmojis} />
        </div>
      ) : null}
    </li>
  );
};

export default EmojiPickerApp;
