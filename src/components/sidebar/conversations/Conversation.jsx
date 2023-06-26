import React from "react";
import moment from "moment";
import { dateHandler } from "../../../utils/date";

const Conversation = ({ convo }) => {
  const picture = convo?.users[1]?.picture;
  return (
    <li className="list-none h-[72px] wfull dark:bg-dark_bg_1 hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]">
      {/* Container */}
      <div className="relative w-full flex items-center justify-between py-[10px]">
        {/* left */}
        <div className="flex items-center gap-x-3">
          {/* Converstion picture */}
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={picture}
              alt={convo?.name}
              className="w-full h-full objext-cover"
            />
          </div>
          {/* converstaion name and message */}
          <div className="w-full flex flex-col">
            {/* Converstion name */}
            <h1 className="font-bold flex items-center gap-x-2">
              {convo?.name}
            </h1>
            {/* Conversation message */}
            <div className="flex items-center gap-x-1 dark:text-dark_text_2">
              <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                {convo?.latestMessage?.message}
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {dateHandler(convo?.latestMessage.createdAt)}
          </span>
        </div>
      </div>
      {/* Border*/}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

export default Conversation;
