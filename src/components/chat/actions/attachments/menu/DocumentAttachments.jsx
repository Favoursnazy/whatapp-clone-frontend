import React from "react";
import { DocumentIcon } from "../../../../../svg";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFiles } from "../../../../../features/chatSlice";
import { getFileType } from "../../../../../utils/file";

const DocumentAttachments = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);
  console.log(files);
  const documentHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "application/plain" &&
        file.type !== "application/msword" &&
        file.type !==
          "appilication/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "appilication/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "appilication/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "appilication/vnd.rar" &&
        file.type !== "appilication/vnd.zip" &&
        file.type !== "audio/mpeg" &&
        file.type !== "audio/wav"
      ) {
        files = files.filter((item) => item.name !== file.name);
        return;
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
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  return (
    <li>
      <button
        type="button"
        className="bg-[#5F66CD] rounded-full"
        onClick={() => inputRef.current.click()}
      >
        <DocumentIcon />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="application/*, text/plain"
        onChange={documentHandler}
      />
    </li>
  );
};

export default DocumentAttachments;
