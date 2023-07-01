import moment from "moment";
import React from "react";
import { BeatLoader } from "react-spinners";

const Typing = () => {
  return (
    <div className={`w-full flex mt-2 space-x-3 max-w-xs`}>
      {/* Message Container */}
      <div>
        <div
          className={`dark:bg-dark_bg_2 relative h-full dark:text-dark_text_1 p-2 rounded-lg `}
        >
          {/* Typing Animation */}
          <BeatLoader color="white" size={10} />
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Typing;
