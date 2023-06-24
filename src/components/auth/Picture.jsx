import React, { useRef, useState } from "react";

const Picture = ({ readablePicture, setReadabalePicture, setPicture }) => {
  const [error, setError] = useState("");
  const inputRef = useRef();
  const handleSelectImage = (e) => {
    let pic = e.target.files[0];
    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp" &&
      pic.type !== "image/jpg"
    ) {
      setError(`${pic.name} format is not supported`);
      return;
    } else if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} is to large, 5mb allowed`);
      return;
    } else {
      setError("");
      setPicture(pic);
      //reading the picture
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setReadabalePicture(e.target.result);
      };
    }
  };

  const handleChangePic = () => {
    setPicture("");
    setReadabalePicture("");
  };
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label className=" text-sm font-bold tracking-wide">
        Picture (Optional. 5mb)
      </label>
      {readablePicture ? (
        <div>
          <img
            className="w-20 h-20 object-cover rounded-full"
            src={readablePicture}
            alt="picture"
          />
          {/* Change image  */}
          <div
            onClick={() => handleChangePic()}
            className="w-20  mt-2 p-1 h-12 dark:bg-dark_bg_3 rounded-md text-xs flex items-center justify-center cursor-pointer"
          >
            Remove
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
        >
          Upload picture
        </div>
      )}
      <input
        type="file"
        name="picture"
        id="picture"
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        hidden
        onChange={handleSelectImage}
      />
      {/* error */}
      {error && (
        <div className="mt-2">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Picture;
