import React, { useEffect } from "react";
import { SideBar } from "../components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../features/chatSlice";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user]);

  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/* Container */}
      <div className="container min-h-screen flex ">
        {/* Sidebar */}
        <SideBar />
      </div>
    </div>
  );
};

export default Home;
