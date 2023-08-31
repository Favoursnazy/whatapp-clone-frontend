import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaTrash } from "react-icons/fa";
import { BsFillPauseFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SendIcon } from "../../../../../svg";
import WaveSurfer from "wavesurfer.js";
import { formatTime } from "../../../../../utils/date";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { sendMessageToUser } from "../../../../../features/chatSlice";

//environment varials
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const CLOUD_SECRET = import.meta.env.VITE_CLOUDINARY_SECRET;

const VoiceRecord = ({ setShowAudioRecorder }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderAudio, setRenderAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redux states
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.socket);
  const { token } = user;
  const dispatch = useDispatch();

  // Ref
  const audioRef = useRef(null);
  const mediaRecordedRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barHeight: 2,
      height: 30,
      responsive: true,
    });

    setWaveForm(waveSurfer);

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBlackTime = () => {
        setCurrentPlayBackTime(recordedAudio.current);
      };
      recordedAudio.addEventListener("timeupdate", updatePlayBlackTime);

      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBlackTime);
      };
    }
  }, [recordedAudio]);

  // Handlingn Start of voice recorder
  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);

    // opening our navigation
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecordedRef.current = mediaRecorder;
        audioRef.current.scrObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, {
            type: "audio/ogg; codecs=opus",
          });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveForm.load(audioURL);
        };
        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing microphone:", error);
      });
  };

  // Handling Stop of Voice recorder
  const handleStopRecording = () => {
    if (mediaRecordedRef.current && isRecording) {
      mediaRecordedRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecordedRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecordedRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderAudio(audioFile);
      });
    }
  };

  // Handling Play of Voice Recorder
  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  // Handling Pausing of voice recorder
  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  // Hanling uploading of voice recorder to cloudinary
  const handleSendAudioRecording = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("upload_preset", CLOUD_SECRET);
    formData.append("file", renderAudio);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      formData
    );
    //send the message
    const values = {
      token,
      message: "",
      convo_id: activeConversation?._id,
      files: [],
      voice: data,
    };
    let newMsg = await dispatch(sendMessageToUser(values));
    socket.emit("send_message", newMsg.payload);
    setLoading(false);
    setShowAudioRecorder(false);
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          size={25}
          onClick={() => setShowAudioRecorder(false)}
          className="cursor-pointer active:bg-dark_bg_1 text-[#E9EDEF]"
        />
      </div>
      <div className="mx-4 py-2 px-4 flex text-white text-lg gap-3 justify-center items-center rounded-full drop-shadow-lg bg-search_input_container_background">
        {isRecording ? (
          <div className="text-red-500 animate-pulse z-60 text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && !isPlaying ? (
              <FaPlay
                color="#E9EDEF"
                size={25}
                onClick={() => handlePlayRecording()}
                className="cursor-pointer active:bg-dark_bg_1"
              />
            ) : (
              <BsFillPauseFill
                color="#E9EDEF"
                size={25}
                onClick={() => handlePauseRecording(false)}
                className="cursor-pointer active:bg-dark_bg_1"
              />
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            size={25}
            onClick={() => handleStartRecording()}
            className="cursor-pointer active:bg-dark_bg_1 text-red-500"
          />
        ) : (
          <FaPauseCircle
            size={25}
            onClick={() => handleStopRecording()}
            className="cursor-pointer active:bg-dark_bg_1 text-red-500"
          />
        )}
      </div>
      {renderAudio && !isPlaying && (
        <button
          className="btn"
          type="button"
          onClick={() => handleSendAudioRecording()}
        >
          {loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      )}
    </div>
  );
};
export default VoiceRecord;
