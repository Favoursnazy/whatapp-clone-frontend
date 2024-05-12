import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { changeStatus, registerUser } from "../../features/userSlice";
import Picture from "./Picture";
import axios from "axios";

//environment varials
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const CLOUD_SECRET = import.meta.env.VITE_CLOUDINARY_SECRET;

const RegisterForm = () => {
  const { status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const [picture, setPicture] = useState("");
  const [readablePicture, setReadabalePicture] = useState("");

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    if (picture) {
      // Uploading the iamge to cloudinary
      await uploadImage().then(async (response) => {
        let res = await dispatch(
          registerUser({ ...data, picture: response.secure_url })
        );
        if (res.payload.user) navigate("/login");
      });
    } else {
      let res = await dispatch(registerUser({ ...data, picture: "" }));
      if (res.payload.user) navigate("/login");
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("upload_preset", CLOUD_SECRET);
    formData.append("file", picture);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return data;
  };
  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* Heaading  */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className=" mt-6 text-3xl font-bold">Welcome</h2>
          <p className=" mt-2 text-sm">Sign up</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className=" mt-6 space-y-6">
          <AuthInput
            name="name"
            type="text"
            labelName="Username"
            placeholder="Full Name"
            register={register}
            error={errors?.name?.message}
          />
          <AuthInput
            name="email"
            type="text"
            labelName="Email"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="status"
            type="text"
            labelName="About me (Optional)"
            placeholder="Eg. Hey there!, am using whatsapp"
            register={register}
            error={errors?.status?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="********"
            labelName="Password"
            register={register}
            error={errors?.password?.message}
          />
          {/* Showing picture */}
          <Picture
            setReadabalePicture={setReadabalePicture}
            setPicture={setPicture}
            readablePicture={readablePicture}
          />
          {/* showing error */}
          {error && (
            <div>
              <p className=" text-red-500">{error}</p>
            </div>
          )}
          {/* Submit Button */}
          <button className=" w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300">
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign up"
            )}
          </button>
          {/* Sign in link */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Have an account</span>
            <Link
              to="/login"
              className=" transition ease-in duration-300 hover:underline cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
