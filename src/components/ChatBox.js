import axios from "axios";
import React, { useState } from "react";
import { MdKeyboardVoice, MdOutlineChat } from "react-icons/md";
import AiChatFlow from "./AiChatFlow";
import AiVoiceFlow from "./AiVoiceFlow";

const ChatBox = ({ onClose, config }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");

  const languages = [
    { code: "en-IN", label: "English" },
    { code: "hi-IN", label: "Hindi" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        model: "sarvam-m",
        messages: [userMessage],
        temperature: 0.7,
        target_language_code: selectedLanguage,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer sk_bxecnrcc_BQhILl6F5JySzjvLRAKIynNJ`,
      };

      const response = await axios.post(
        "https://api.sarvam.ai/v1/chat/completions",
        payload,
        { headers }
      );

      const reply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "system", text: reply }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 h-[36rem] min-w-[30rem] bg-white shadow-2xl rounded-2xl flex flex-col z-50">
      <div
        style={{ backgroundColor: `${config.theme.primaryColor}E6` }}
        className="flex justify-between items-center text-white p-3 rounded-t-2xl"
      >
        <span>{config.agent?.name}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="overflow-y-auto p-3 text-sm border-b text-gray-700 flex items-center justify-between">
        <p>👋 Hello! How can I help you?</p>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {chatMode ? (
        <AiChatFlow messages={messages} loading={loading} />
      ) : (
        <AiVoiceFlow language={selectedLanguage} />
      )}

      <div className="border-t items-center p-2 flex gap-2">
        {config.enableVoice && (
          <div
            style={{ backgroundColor: `${config.theme.primaryColor}E6` }}
            className="text-white p-2 rounded-full cursor-pointer"
            onClick={() => {
              setChatMode((prev) => !prev);
              setInput("");
            }}
          >
            {chatMode ? (
              <MdKeyboardVoice size={20} />
            ) : (
              <MdOutlineChat size={20} />
            )}
          </div>
        )}

        <input
          type="text"
          disabled={!chatMode}
          value={input}
          placeholder="Type a message..."
          className="border rounded-full flex-1 px-3 py-1 text-sm"
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          style={{ backgroundColor: `${config.theme.primaryColor}E6` }}
          className="text-white px-3 py-1 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
