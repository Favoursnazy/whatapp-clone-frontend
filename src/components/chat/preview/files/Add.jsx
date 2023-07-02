import { useRef } from "react";
import { CloseIcon } from "../../../../svg";
import { useDispatch } from "react-redux";
import { addFiles } from "../../../../features/chatSlice";
import { getFileType } from "../../../../utils/file";

const Add = ({ setActiveIndex }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const filesHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/plain" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "appilication/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.rar" &&
        file.type !== "application/x-zip-compressed" &&
        file.type !== "audio/mpeg" &&
        file.type !== "audio/wav" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp" &&
        file.type !== "image/gif" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "video/webm"
      ) {
        // files = files.filter((item) => item.name !== file.name);
        // return;
        console.log(file);
      } else if (file.size > 1024 * 1024 * 5) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              imgData:
                getFileType(file.type) === "IMAGE" ? e.target.result : "",
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  return (
    <>
      <div
        onClick={() => inputRef.current.click()}
        className="w-14 mt-2 h-14 border dark:border-white rounded-md flex items-center justify-center cursor-pointer"
      >
        <span className="rotate-45">
          <CloseIcon className="dark:fill-dark_svg_1" />
        </span>
      </div>
      <input
        type="file"
        multiple
        hidden
        ref={inputRef}
        accept="application/*,text/plain,image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg,video/webm"
        onChange={filesHandler}
      />
    </>
  );
};

export default Add;
