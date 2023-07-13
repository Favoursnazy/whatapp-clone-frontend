import { ArrowIcon, MuteIcon } from "../../../svg";
import { RxSpeakerLoud } from "react-icons/rx";
import { BiSolidVideo } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { end_a_user_call } from "../../../features/callSlice";
import SocketContext from "../../../context/SocketContext";

const CallActions = ({ socket, tracks }) => {
  const dispatch = useDispatch();
  const { call } = useSelector((state) => state.call);

  const handleEndCall = () => {
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    socket.emit("endCall", call);
    dispatch(end_a_user_call());
  };
  return (
    <div className="h-22 w-full absolute bottom-0 z-40 px-1 ">
      {/* Container */}
      <div className="relative bg-[#222] px-4 pb-12 pt-6 rounded-xl">
        {/* Expand icon */}
        <button className="-rotate-90 scale-y-[300%] absolute top-1 left-1/2">
          <ArrowIcon className="fill-dark_svg_2" />
        </button>
        {/* Actions */}
        <ul className="flex items-center justify-between">
          <li>
            <button className="btn_secondary">
              <RxSpeakerLoud size={25} color="white" />
            </button>
          </li>
          <li>
            <button className="btn_secondary">
              <BiSolidVideo color="white" size={25} />
            </button>
          </li>
          <li>
            <button className="btn_secondary">
              <MuteIcon className="fill-white" />
            </button>
          </li>
          <li onClick={() => handleEndCall()}>
            <button className="btn_secondary bg-red-600 rotate-[135deg]">
              <IoCall color="white" size={25} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const CallActionsWithSocket = (props) => {
  return (
    <SocketContext.Consumer>
      {(socket) => <CallActions socket={socket} {...props} />}
    </SocketContext.Consumer>
  );
};

export default CallActionsWithSocket;
