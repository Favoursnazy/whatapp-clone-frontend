import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
import { clearSocket } from "../../../features/socketSlice";

const Menu = ({ setCreateGroup }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearSocket());
    window.location.reload();
  };
  return (
    <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
      <ul>
        <li
          onClick={() => setCreateGroup((prev) => !prev)}
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
        >
          <span>New Group</span>
        </li>
        <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
          <span>New Community</span>
        </li>
        <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
          <span>Starred Messages</span>
        </li>
        <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
          <span>Settings</span>
        </li>
        <li
          onClick={() => dispatch(logout())}
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
        >
          <span>Log out</span>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
