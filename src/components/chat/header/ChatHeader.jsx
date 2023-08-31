import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatUsername, getUserProfilePicture } from "../../../utils/chat";
import { DotsIcon, SearchLargeIcon } from "../../../svg";
import { BiVideo } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { clearMessageAndActiveConvo } from "../../../features/chatSlice";

const ChatHeader = ({ online, callUser, audioCall, setToggleMobile }) => {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // GETTING USER PICTURE
  const picture = activeConversation.isGroup
    ? activeConversation.picture
    : getUserProfilePicture(user, activeConversation.users);

  // GETTING USER NAME
  const name = activeConversation.isGroup
    ? activeConversation.name
    : getChatUsername(user, activeConversation.users);

  // SHOW NAME OF PEOPLE IN CURRENT GROUP
  const showGroupUsers = () => {
    if (activeConversation.isGroup) {
      const newNames = activeConversation.users.map((user) => `${user.name}, `);
      return newNames;
    }
  };

  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      {/* Container */}
      <div className="w-full flex items-center justify-between">
        {/* right */}
        <div className="flex items-center gap-x-4">
          {/* Converstion Image */}
          <button
            className="lg:hidden"
            onClick={() => {
              sessionStorage.setItem("activeConvo", null);
              setToggleMobile(false);
              dispatch(clearMessageAndActiveConvo());
            }}
          >
            <IoIosArrowBack className="dark:fill-dark_svg_1" size={24} />
          </button>
          <button className="btn">
            <img
              src={picture}
              alt={`${name} picture`}
              className="w-full h-full object-cover rounded-full"
            />
          </button>
          {/* Conversation name and online status */}
          <div className="flex flex-col">
            <h6 className="dark:text-white text-md font-bold truncate whitespace-nowrap">
              {name}
            </h6>
            <span className="text-xs dark:text-dark_svg_2">
              {online
                ? "Online"
                : activeConversation.isGroup
                ? showGroupUsers()
                : ""}
            </span>
          </div>
        </div>
        {/* right */}
        <ul className="flex items-center gap-x-1.5">
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
