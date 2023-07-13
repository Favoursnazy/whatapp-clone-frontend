import React from "react";
import { useSelector } from "react-redux";
import { getChatUsername, getUserProfilePicture } from "../../../utils/chat";
import { DotsIcon, SearchLargeIcon } from "../../../svg";
import { BiVideo } from "react-icons/bi";
import { IoCall } from "react-icons/io5";

const ChatHeader = ({ online, callUser, audioCall }) => {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const picture = activeConversation.isGroup
    ? activeConversation.picture
    : getUserProfilePicture(user, activeConversation.users);
  const name = activeConversation.isGroup
    ? activeConversation.name
    : getChatUsername(user, activeConversation.users);

  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      {/* Container */}
      <div className="w-full flex items-center justify-between">
        {/* right */}
        <div className="flex items-center gap-x-4">
          {/* Converstion Image */}
          <button className="btn">
            <img
              src={picture}
              alt={`${name} picture`}
              className="w-full h-full object-cover rounded-full"
            />
          </button>
          {/* Conversation name and online status */}
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold ">{name}</h1>
            <span className="text-xs dark:text-dark_svg_2">
              {online ? "Online" : ""}
            </span>
          </div>
        </div>
        {/* right */}
        <ul className="flex items-center gap-x-2.5">
          {online && (
            <>
              <li onClick={() => callUser()}>
                <button className="btn">
                  <BiVideo className="dark:fill-dark_svg_1" size={24} />
                </button>
              </li>
              <li onClick={() => audioCall()}>
                <button className="btn">
                  <IoCall className="dark:fill-dark_svg_1" size={24} />
                </button>
              </li>
            </>
          )}

          <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
