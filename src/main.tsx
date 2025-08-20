import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PreferencesProvider } from "./context/PreferencesContext";
import { GameProvider } from "./context/GameContext";
import { StatisticsProvider } from "./context/StatisticsContext";

console.log("Starting to render app with all context providers");
try {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PreferencesProvider>
        <GameProvider>
          <StatisticsProvider>
            <App />
          </StatisticsProvider>
        </GameProvider>
      </PreferencesProvider>
    </StrictMode>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
}
