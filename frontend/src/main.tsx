import { createRoot } from "react-dom/client";
import "./index.css";
import "./font.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthProvider.tsx";
import { ChatProvider } from "./context/ChatContext/ChatProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
