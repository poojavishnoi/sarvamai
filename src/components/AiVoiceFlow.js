import React, { useRef, useState } from "react";

function AiVoiceFlow({ language }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [responseAudio, setResponseAudio] = useState([]);
  const audioRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  function base64ToBlob(base64, mime) {
    const byteChars = atob(base64);

    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const startRecording = async () => {
    setAudioURL(null);
    setResponseAudio([]);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      sendAudioToSarvam(audioBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    audioRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendAudioToSarvam = async (audioBlob) => {
    const API_KEY = "sk_ugx1miow_2QNjeoqO4WAa70ZSficQtddQ";

    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("language_code", language);

    const transcriptionRes = await fetch(
      "https://api.sarvam.ai/speech-to-text",
      {
        method: "POST",
        headers: {
          "api-subscription-key": API_KEY,
        },
        body: formData,
      }
    );

    const transcriptionData = await transcriptionRes.json();
    const text = transcriptionData.transcript;

    // Step 2: Send text to Sarvam-M (chat model)
    const chatRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "user", content: text }],
      }),
    });

    const chatData = await chatRes.json();
    const replyText = chatData.choices?.[0].message.content;

    // Step 3: Convert AI reply → voice (Sarvam’s Text-to-Speech API)
    const ttsRes = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": API_KEY,
      },
      body: JSON.stringify({
        text: replyText,
        target_language_code: language,
      }),
    });

    const data = await ttsRes.json();
    const base64Audio = data.audios?.[0];
    const blob = base64ToBlob(base64Audio, "audio/wav");
    const audioUrl = URL.createObjectURL(blob);

    setResponseAudio(audioUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full font-semibold w-44  ${
          recording ? "bg-red-500 text-white" : "bg-gray-100"
        }`}
      >
        {recording ? "Stop Recording" : "Start Talking"}
      </button>
      <div className="h-full ">
        {audioURL && (
          <div className="mt-1 ">
            <p className="mb-1 text-sm text-gray-600">Your voice input:</p>
            <audio controls src={audioURL} className="w-64" />
          </div>
        )}

        {responseAudio.length > 0 && (
          <div className="mt-1">
            <p className="mb-1 text-sm text-gray-600">AI reply:</p>
            <audio controls src={responseAudio} className="w-64 my-2" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AiVoiceFlow;
