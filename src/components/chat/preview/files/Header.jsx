import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../../../../svg";
import { clearFiles } from "../../../../features/chatSlice";

const Header = ({ activeIndex }) => {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);
  const clearFileHandler = () => {
    dispatch(clearFiles());
  };
  return (
    <div className="w-full">
      {/* container */}
      <div className=" ml-4 w-full flex items-center justify-between">
        {/* Close icons /empty all files */}
        <div className="cursor-pointer" onClick={() => clearFileHandler()}>
          <CloseIcon className="dark:fill-dark_svg_1" />
        </div>
        {/* {File Name from the state} */}
        <h1 className="dark:text-dark_text_1 text-[15px] ">
          {files?.[activeIndex].file?.name}
        </h1>
        {/* empty tag */}
        <span></span>
      </div>
    </div>
  );
};

export default Header;
