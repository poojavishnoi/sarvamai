import { useEffect } from "react";
import "./App.css";
import ChatWidget from "./components/ChatWidget";

function App() {
  const config = window.AgentWidgetConfig || {
    position: "bottom-right",
    theme: { primaryColor: "#e57646", fontFamily: "loka, serif" },
    agent: { name: "AI Assistant", avatar: "" },
    enableVoice: true,
    context: "",
  };

  function loadFont(fontName) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replaceAll(
      " ",
      "+"
    )}&display=swap`;
    document.head.appendChild(link);
  }

  useEffect(() => {
    if (config?.theme?.fontFamily) {
      const mainFont = config.theme.fontFamily.split(",")[0];
      loadFont(mainFont);
    }
  }, [config?.theme?.fontFamily]);

  return (
    <div style={{ fontFamily: config.theme.fontFamily }} className="App">
      <ChatWidget config={config} />
    </div>
  );
}

export default App;
