// Điểm vào (entry point) của toàn bộ ứng dụng.
// Render component <App /> vào thẻ <div id="root"> trong index.html.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);