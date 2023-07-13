const Input = ({ name, setName }) => {
  return (
    <div className="mt-4 ">
      <input
        placeholder="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-1 "
      />
    </div>
  );
};

export default Input;
