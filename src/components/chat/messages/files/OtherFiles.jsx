import { BsArrowDownCircle } from "react-icons/bs";

const OtherFiles = ({ file, type, me }) => {
  return (
    <div
      className={`${me ? "bg-green_4" : "dark:bg-dark_bg_1"} p-2 rounded-lg`}
    >
      {/* container */}
      <div className="flex justify-between gap-x-8">
        {/* file infos */}
        <div className="flex items-center gap-2">
          <img
            src={`../../../../images/files/${type}.png`}
            alt=""
            className="w-8 object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1>
              {file.original_filename}.{file.public_id.split(".")[1]}
            </h1>
            <span className=" text-sm">
              {type} . {file.bytes}B
            </span>
          </div>
        </div>
        {/* Download button */}
        <a href={file.secure_url} target="_blank" download>
          <BsArrowDownCircle size={30} />
        </a>
      </div>
    </div>
  );
};

export default OtherFiles;
