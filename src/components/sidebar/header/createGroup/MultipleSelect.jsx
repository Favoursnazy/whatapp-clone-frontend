import Select from "react-select";

const MultipleSelect = ({
  selectedUsers,
  searchResults,
  setSelectedUsers,
  handleSearch,
}) => {
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        isMulti
        onChange={setSelectedUsers}
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-1">
            <img
              src={user.picture}
              className="w-8 h-8 rounded-full object-cover"
              alt={user.name}
            />
            <span className="text-[#222]">{user.label}</span>
          </div>
        )}
        onKeyDown={(e) => handleSearch(e)}
        placeholder="Search, select users"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: "none",
            borderColor: "transparent",
            background: "transparent",
            outlineColor: "none",
          }),
        }}
      />
    </div>
  );
};

export default MultipleSelect;
