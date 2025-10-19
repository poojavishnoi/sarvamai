import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import ChatBox from "./ChatBox";

import { CiChat1 } from "react-icons/ci";

const ChatWidget = ({ config }) => {
  const positionConfig = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const [isOpen, setIsOpen] = useState(false);
  const positionClasses =
    positionConfig[config?.position] || "bottom-6 right-6";

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: `${config.theme.primaryColor}E6`,
        }}
        className={`fixed ${positionClasses}  text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-orange-500 z-50`}
      >
        <CiChat1 size={30} />
      </div>

      <div className="relative">
        {isOpen && <ChatBox config={config} onClose={() => setIsOpen(false)} />}
      </div>
    </>
  );
};

export default ChatWidget;
