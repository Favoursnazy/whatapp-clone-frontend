import { useSelector } from "react-redux";

const FileViewer = ({ activeIndex }) => {
  const { files } = useSelector((state) => state.chat);
  return (
    <div className="w-full max-w-[60%] ">
      {/* Container */}
      <div className="flex justify-center items-center">
        {files?.[activeIndex].type === "IMAGE" ? (
          <img
            src={files?.[activeIndex].imgData}
            alt=""
            className="max-w-[80%] object-contain hview"
          />
        ) : files[activeIndex].type === "VIDEO" ? (
          <video
            src={files?.[activeIndex].imgData}
            controls
            className="max-w-[80%] object-contain hview"
          ></video>
        ) : (
          <div className="min-w-full hview flex flex-col items-center justify-center">
            {/* File icon image */}
            <img
              src={`../../../../images/files/${files[activeIndex].type}.png`}
              alt={files[activeIndex].type}
            />
            {/* No Preview Text */}
            <h1 className="dark:text-dark_text_2 text-xl">
              No preview available
            </h1>
            {/* File size and type */}
            <span className="dark:text-dark_text_2">
              {files[activeIndex]?.file?.size} kb - {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
