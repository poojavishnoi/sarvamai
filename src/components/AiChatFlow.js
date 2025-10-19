import React from "react";

function AiChatFlow({ messages, loading }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg?.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm ${
              msg?.sender === "user"
                ? "border border-gray-200 "
                : "border border-gray-200  "
            }`}
          >
            {msg?.text}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="text-gray-600 text-sm animate-pulse">
            🤔 Thinking...
          </div>
        </div>
      )}
    </div>
  );
}

export default AiChatFlow;
