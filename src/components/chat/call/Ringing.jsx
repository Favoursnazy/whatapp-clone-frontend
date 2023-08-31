import React, { useRef, useState } from "react";
import { CloseIcon } from "../../../svg";
import { AiOutlineCheck } from "react-icons/ai";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { end_a_user_call } from "../../../features/callSlice";
import { toast } from "react-hot-toast";
import Header from "./Header";
import CallArea from "./CallArea";
import CallActions from "./CallActions";
import Draggable from "react-draggable";

const Ringing = () => {
  const { socket } = useSelector((state) => state.socket);
  const { call, peerId } = useSelector((state) => state.call);
  const { name, picture } = call;
  const { user } = useSelector((state) => state.user);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null);
  const [showAction, setShowAtion] = useState(false);
  const [toggleVideo, setToggleVideo] = useState(false);

  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const dispatch = useDispatch();

  // Video Ref
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    const setSecInCall = () => {
      setTotalSecInCall((prev) => prev + 1);
      setTimeout(setSecInCall, 1000);
    };

    setSecInCall();

    return () => setTotalSecInCall(0);
  }, []);

  useEffect(() => {
    if (answer) {
      setTotalSecInCall(0);
    } else {
      const timer = setTimeout(() => {
        socket.emit("endCall", call);
        dispatch(end_a_user_call());
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, answer, call, socket]);

  // End Call UseEffect
  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      tracks && tracks.forEach((track) => track.stop());
      dispatch(end_a_user_call());
    });

    return () => socket.off("endCallToClient");
  }, [socket, dispatch, tracks]);

  // User Busy UseEffect
  useEffect(() => {
    socket.on("userBusy", (data) => {
      toast.error(`${call.name} is busy now!`, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    return () => socket.off("userBusy");
  }, [socket, dispatch, call]);

  // User disconnect from call
  useEffect(() => {
    socket.on("callDisconnect", () => {
      tracks && tracks.forEach((track) => track.stop());
      dispatch(end_a_user_call());
      toast.error(`${call.name} just disconnected!`, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    return () => socket.off("callDisconnect");
  }, [socket, tracks, dispatch]);

  // Open Stream
  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  //Play stream
  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
  };

  // Handle Answer Call
  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(myVideo.current, stream);
      const tracks = stream.getTracks();
      setTracks(tracks);

      //
      const newCall = peerId.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        playStream(userVideo.current, remoteStream);
      });
      setAnswer(true);
    });
  };

  useEffect(() => {
    peerId.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (myVideo.current) {
          playStream(myVideo.current, stream);
        }

        const tracks = stream.getTracks();
        setTracks(tracks);

        newCall.answer(stream);
        newCall.on("stream", function (remoteStream) {
          if (userVideo.current) {
            playStream(userVideo.current, remoteStream);
          }
        });
        setAnswer(true);
      });
    });

    return () => peerId.removeListener("call");
  }, [peerId, call.video]);

  // Handle EndCall
  const handleEndCall = () => {
    tracks && tracks.forEach((track) => track.stop());

    socket.emit("endCall", call);
    dispatch(end_a_user_call());
  };

  return (
    <>
      {!answer && (
        <Draggable>
          <div className="dark:bg-dark_bg_1 max-md:w-full max-md:mx-10 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg z-30">
            {/* Container */}
            <div className="p-4 flex items-center justify-between gap-x-8">
              {/* Call Info */}
              <div className="flex items-center gap-x-2">
                <img
                  src={picture}
                  alt="caller picture"
                  className="w-28 h-28 rounded-full"
                />
                <div>
                  <h1 className="dark:text-white ">
                    <b>{name}</b>
                  </h1>
                  {/* Incoming and Outgoing Video Call Display to users */}
                  {call.reciever === user.id && !answer ? (
                    <span className="dark:text-dark_text_2">
                      Incoming Video Call
                    </span>
                  ) : (
                    <span className="dark:text-dark_text_2">
                      Outgoing Video Call
                    </span>
                  )}
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
                </div>
              </div>
              {/* call actions */}
              <ul className="flex items-center gap-x-2">
                {call.reciever === user.id && !answer ? (
                  <>
                    <li onClick={() => handleEndCall()}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
                        <CloseIcon className="fill-white w-5" />
                      </button>
                    </li>
                    <li onClick={() => handleAnswer()}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500">
                        <AiOutlineCheck className="w-6" />
                      </button>
                    </li>
                    {/* Ringtone */}
                    <audio
                      src="../../../../audio/ringing.mp3"
                      autoPlay
                      loop
                    ></audio>
                  </>
                ) : (
                  <li onClick={() => handleEndCall()}>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
                      <CloseIcon className="fill-white w-5" />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Draggable>
      )}
      {/* Video Call and Audio Call Area */}
      {
        <Draggable defaultPosition={{ x: 0, y: 0 }} position={null}>
          <div
            className={` ${
              answer ? "" : "hidden"
            } fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-40 rounded-2xl overflow-hidden callBg
      `}
            onMouseOver={() => setShowAtion(true)}
            onMouseOut={() => setShowAtion(false)}
          >
            {/* Container */}
            <div>
              <div>
                {/* Header */}
                <Header />
                {/* Call Area */}
                <CallArea name={name} />
                {/* Call actions */}
                {showAction && <CallActions tracks={tracks} />}
              </div>
              {/* Video Stream */}
              <div>
                {/* user video */}
                <div hidden={!call.video}>
                  <video
                    ref={userVideo}
                    playsInline
                    autoPlay
                    className={
                      toggleVideo ? "SmallVideoCall" : "LargeVideoCall"
                    }
                    onClick={() => setToggleVideo((prev) => !prev)}
                  ></video>
                </div>
                {/* my video */}
                <div hidden={!call.video}>
                  <video
                    ref={myVideo}
                    playsInline
                    autoPlay
                    className={`${
                      toggleVideo ? "LargeVideoCall" : "SmallVideoCall"
                    } ${showAction ? "moveVideoCall" : ""}`}
                    onClick={() => setToggleVideo((prev) => !prev)}
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      }
    </>
  );
};

export default Ringing;
