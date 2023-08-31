import moment from "moment";
import MessageStatus from "../../sidebar/MessageStatus";

const Message = ({ message, me }) => {
  return (
    <div
      className={`w-full flex mt-2 space-x-3 lg:max-w-xl md:max-w-lg sm:max-sm ${
        me ? "ml-auto justify-end" : ""
      } `}
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
          className={`relative h-full  dark:text-dark_text_1 p-2 rounded-lg ${
            me ? "bg-green_3" : "dark:bg-dark_bg_2"
          }`}
        >
          {/* Message */}
          <p className="h-full text-base pb-3 pr-10">{message.message}</p>
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

export default Message;
