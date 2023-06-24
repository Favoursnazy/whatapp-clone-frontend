import { Toaster } from "react-hot-toast";

import React from "react";

const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 2000,
      }}
    />
  );
};

export default ToastContainer;
