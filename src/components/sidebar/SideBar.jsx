import React, { useState } from "react";
import { SideBarHeader } from "./header";
import { Notifications } from "./notification";
import { Search, SearchResults } from "./search";
import { Conversations } from "./conversations";

const SideBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div className="w-[40%] h-full select-none">
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
          <Conversations />
        </>
      )}
    </div>
  );
};

export default SideBar;
