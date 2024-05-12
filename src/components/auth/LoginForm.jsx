import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SigInSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/userSlice";
import { initializeSocket } from "../../features/socketSlice";
import { io } from "socket.io-client";
import { SERVER_URL } from "../../utils/constants";

const globalSocket = io(SERVER_URL);

const LoginForm = () => {
  const { status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SigInSchema),
  });

  const onSubmit = async (data) => {
    let res = await dispatch(loginUser({ ...data }));
    if (res.payload?.user) {
      dispatch(initializeSocket(globalSocket));
      navigate("/");
    }
    await localStorage.setItem("token", res.payload?.user.token);
  };

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* Heaading  */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className=" mt-6 text-3xl font-bold">Welcome</h2>
          <p className=" mt-2 text-sm">Sign in</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className=" mt-6 space-y-6">
          <AuthInput
            name="email"
            type="text"
            labelName="Email"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />

          <AuthInput
            name="password"
            type="password"
            placeholder="********"
            labelName="Password"
            register={register}
            error={errors?.password?.message}
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
            <span>Do not have an account?</span>
            <Link
              to="/register"
              className=" transition ease-in duration-300 hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
