import { useState } from "react";
import { ReturnIcon } from "../../../../svg";
import Input from "./Input";
import MultipleSelect from "./MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { GrStatusGood } from "react-icons/gr";
import { createGroupConversation } from "../../../../features/chatSlice";

// ENV
const SEARCH_ENDPOINT = `${import.meta.env.VITE_API_ENDPOINT}`;

const CreateGroup = ({ setCreateGroup }) => {
  const [name, setName] = useState("");
  const { user } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.chat);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  // Handle search Function
  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      setSearchResults([]);
      try {
        const { data } = await axios.get(
          `${SEARCH_ENDPOINT}/users?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (data.length > 0) {
          let tempArray = [];
          data.forEach((user) => {
            let temp = {
              value: user._id,
              label: user.name,
              picture: user.picture,
            };

            tempArray.push(temp);
          });
          setSearchResults(tempArray);
        } else {
          searchResults([]);
        }
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    } else {
      setSearchResults([]);
    }
  };

  // create group
  const createGroupHandler = async () => {
    if (status !== "loading") {
      let users = [];
      selectedUsers.forEach((user) => {
        users.push(user.value);
      });
      let values = {
        name,
        users,
        token: user.token,
      };
      let newConvo = await dispatch(createGroupConversation(values));
    }
  };
  return (
    <div className="createGroupAnimation relative flex0030 h-full z-40">
      {/* Container */}
      <div className="mt-5">
        {/* Close button */}
        <button
          className="btn w-6 h-6 border"
          onClick={() => setCreateGroup(false)}
        >
          <ReturnIcon className="fill-white" />
        </button>
        {/* group name input */}
        <Input name={name} setName={setName} />
        {/* Multiple select */}
        <MultipleSelect
          selectedUsers={selectedUsers}
          searchResults={searchResults}
          setSelectedUsers={setSelectedUsers}
          handleSearch={handleSearch}
        />
        {/* Create group button */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 max-h-fit">
          <button
            className="btn bg-green_1 scale-150 hover:bg-green-500"
            onClick={() => createGroupHandler()}
          >
            {status === "loading" ? (
              <ClipLoader color="#E9EDEF" size={25} />
            ) : (
              <GrStatusGood color="#E9EDEF" size={25} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
