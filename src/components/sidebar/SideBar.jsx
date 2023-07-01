import React, { useState } from "react";
import { SideBarHeader } from "./header";
import { Notifications } from "./notification";
import { Search, SearchResults } from "./search";
import { Conversations } from "./conversations";

const SideBar = ({ onlineUsers, typing }) => {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div className="flex0030 m-w-[30%] h-full select-none">
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
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        </>
      )}
    </div>
  );
};

export default SideBar;
