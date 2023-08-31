import moment from "moment";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { BsFillPauseFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { formatTime } from "../../../../utils/date";
import MessageStatus from "../../../sidebar/MessageStatus";

const VoiceMessageFile = ({ message, me }) => {
  const [audioMessage, setAudioMessage] = useState(null);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  //   REF
  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  useEffect(() => {
    waveForm.current = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barHeight: 2,
      height: 30,
      responsive: true,
    });

    waveForm.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      waveForm.current.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = message.voice.secure_url;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    waveForm.current.load(audioURL);
    waveForm.current.on("ready", () => {
      setTotalDuration(waveForm.current.getDuration());
    });
  }, [message.voice.secure_url]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlayBlackTime = () => {
        setCurrentPlayBackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlayBlackTime);

      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlayBlackTime);
      };
    }
  }, [audioMessage]);

  // Handling Play of Voice Recorder
  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.stop();
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  // Handling Pausing of voice recorder
  const handlePauseAudio = () => {
    waveForm.current.stop();
    audioMessage.pause();
    setIsPlaying(false);
  };

  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end" : ""
      }  `}
    >
      {/* Message Container */}
      <div className="relative">
        {/* sender user message */}
        {!me && message.conversation.isGroup && (
          <div className="absolute top-0.5 left-[-37px]">
            <img
              src={message.sender.picture}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        <div
          className={`relative h-full flex  items-center justify-center gap-5 px-4 pr-2 py-4 dark:text-dark_text_1 p-2 rounded-lg ${
            me ? "bg-green_3" : "dark:bg-dark_bg_2"
          } ${!me && "flex-row-reverse"} `}
        >
          <div className="h-14 w-14 relative">
            <img src={message.sender.picture} className="rounded-full" alt="" />
          </div>
          <div className="text-xl">
            {!isPlaying ? (
              <FaPlay
                color="#E9EDEF"
                size={25}
                onClick={() => handlePlayAudio()}
                className="cursor-pointer active:bg-dark_bg_1"
              />
            ) : (
              <BsFillPauseFill
                color="#E9EDEF"
                size={25}
                onClick={() => handlePauseAudio()}
                className="cursor-pointer active:bg-dark_bg_1"
              />
            )}
          </div>
          <div className="relative">
            <div className="w-60" ref={waveFormRef} />
            <div className="text-bubble_meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
              <span>
                {formatTime(isPlaying ? currentPlayBackTime : totalDuration)}
              </span>
            </div>
          </div>
          {/* Message Date */}
          <div className="flex items-center justify-center gap-1 absolute right-1.5 bottom-1.5">
            <span className="text-xs text-dark_text_5 leading-none">
              {moment(message.createdAt).format("LT")}
            </span>
            {me && <MessageStatus messageStatus={message?.status} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessageFile;
