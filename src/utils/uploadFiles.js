import axios from "axios";

//environment varials
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const CLOUD_SECRET = import.meta.env.VITE_CLOUDINARY_SECRET;

export const uploadFiles = async (files) => {
  let formData = new FormData();
  formData.append("upload_preset", CLOUD_SECRET);
  let uploaded = [];
  for (const f of files) {
    const { file, type } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    uploaded.push({
      file: res,
      type: type,
    });
  }
  return uploaded;
};

//Upload to cloudinary function
const uploadToCloudinary = async (formData) => {
  return new Promise(async (resolve) => {
    return await axios
      .post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        formData
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
