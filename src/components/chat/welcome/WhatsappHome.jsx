import React from "react";
import { Logo } from "../../../svg";

const WhatsappHome = () => {
  return (
    <div className="h-full w-full dark:bg-dark_bg_4 select-none border-l dark:border-l-dark_border_2 border-b-[6px] border-green_2">
      {/* Container */}
      <div className="-mt-1.5 wfull h-full flex flex-col gap-y-8 items-center justify-center">
        <span>
          <Logo />
        </span>
        {/* Infos */}
        <div className="mt-1 text-center space-y-[12px]">
          <h1 className="text-[32px] dark:text-dark_text_4 font-extralight">
            Whatsapp Web
          </h1>
          <p className="text-sm dark:text-dark_text_3 ">
            send and recieve messages without keeping your phone online.
            <br />
            Use whatsapp on up to 4 linked devices and 1 phone at same time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappHome;
