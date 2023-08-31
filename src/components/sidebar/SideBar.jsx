import React, { useState } from "react";
import { SideBarHeader } from "./header";
import { Notifications } from "./notification";
import { Search, SearchResults } from "./search";
import { Conversations } from "./conversations";

const SideBar = ({ onlineUsers, typing, setToggleMobile, toggleMobile }) => {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div
      className={`${
        toggleMobile && "sm:hidden max-sm:hidden md:hidden lg:block"
      } lg:flex0030 lg:m-w-[30%] h-full select-none sm:w-full max-sm:w-full md:w-full `}
    >
      {/* Sidebar Header */}
      <SideBarHeader />
      {/* Notifiactions */}
      <Notifications />
      {/* Search  */}
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {searchResults.length > 0 ? (
        <>
          {/* Serch Results */}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/* Converstions */}
          <Conversations
            setToggleMobile={setToggleMobile}
            onlineUsers={onlineUsers}
            typing={typing}
          />
        </>
      )}
    </div>
  );
};

export default SideBar;
