import { useEffect } from "react";
import "./App.css";
import ChatWidget from "./components/ChatWidget";
import React from "react";

// Error Boundary Component
class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an external service here
    console.error("ChatWidget error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "1rem", color: "#fff", background: "#f56565" }}>
          ChatWidget failed to load.
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <ChatErrorBoundary>
        <ChatWidget config={config} />
      </ChatErrorBoundary>
    </div>
  );
}

export default App;
