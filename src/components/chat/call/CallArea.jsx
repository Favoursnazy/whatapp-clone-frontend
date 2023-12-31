import { useEffect, useState } from "react";
import { capitalize } from "../../../utils/string";
import { useSelector } from "react-redux";

const CallArea = ({ name }) => {
  const { call } = useSelector((state) => state.call);
  const [totalSecInCall, setTotalSecInCall] = useState(0);

  useEffect(() => {
    const setSecInCall = () => {
      setTotalSecInCall((prev) => prev + 1);
      setTimeout(setSecInCall, 1000);
    };

    setSecInCall();

    return () => setTotalSecInCall(0);
  }, []);

  return (
    <div className="absolute z-40 top-12 w-full p-1">
      {/* Container */}
      <div className="flex flex-col items-center">
        {/* Call infos */}
        <div className="flex flex-col items-center gap-y-1">
          <h1 className="text-white text-lg">
            <b>{name ? capitalize(name) : null}</b>
          </h1>
          <div className="text-dark_text_1">
            {parseInt(totalSecInCall / 3600 >= 0) ? (
              <>
                <small>
                  {parseInt(totalSecInCall / 3600).toString().length < 2
                    ? "0" + parseInt(totalSecInCall / 3600)
                    : parseInt(totalSecInCall / 3600)}
                </small>
                <small>:</small>
              </>
            ) : null}
            <small>
              {parseInt(totalSecInCall / 60).toString().length < 2
                ? "0" + parseInt(totalSecInCall / 60)
                : parseInt(totalSecInCall / 60)}
            </small>
            <small>:</small>
            <small>
              {(totalSecInCall % 60).toString().length < 2
                ? "0" + (totalSecInCall % 60)
                : totalSecInCall % 60}
            </small>
          </div>
          {/* Call Image */}
          {!call.video && (
            <div className="h-20 w-20 gap-x-40">
              <img
                src={call?.picture}
                alt=""
                className="w-full h-full object-cover  rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallArea;
