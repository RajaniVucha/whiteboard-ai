import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import ImageClassification from "./components/ImageClassification";
import Whiteboard from "./components/Whiteboard";
import Toolbar from "./components/Toolbar";
import { httpClient } from "./components/HttpClient";
import Keycloak, { KeycloakInstance, KeycloakConfig } from "keycloak-js"; // Import KeycloakInstance

import "./App.css";

// Interface for App component props
interface AppProps {}

const App: React.FC<AppProps> = () => {
  // State hooks
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [sessionID, setSessionID] = useState<string>("");

  // Event handlers
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const handleCreateSession = () => {
    const newSessionID = generateSessionID();
    setSessionID(newSessionID);
  };

  const handleJoinSession = (sessionID: string) => {
    setSessionID(sessionID);
  };

  const generateSessionID = (): string => {
    return "uniqueSessionID"; // Replace with your session ID generation logic
  };

  // Keycloak initialization options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initOptions: KeycloakConfig = {
    url: "http://localhost:8080/",
    realm: "myrealm",
    clientId: "myclient",
  };

  // Create a new Keycloak instance
  const [kc, setKc] = useState<KeycloakInstance | null>(null);

  useEffect(() => {
    const keycloak = Keycloak(initOptions);
    setKc(keycloak);
    keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: true,
        pkceMethod: "S256",
      })
      .then((auth: boolean) => {
        if (!auth) {
          window.location.reload();
        } else {
          console.info("Authenticated");
          console.log("Access Token", keycloak.token);
          httpClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${keycloak.token}`;
          keycloak.onTokenExpired = () => {
            console.log("token expired");
          };
        }
      })
      .catch(() => {
        console.error("Authentication Failed");
      });
  }, [initOptions]);

  if (!kc) {
    return null; // Render nothing while Keycloak instance is being initialized
  }

  return (
    <Router>
      <Header title="AI-Powered Whiteboard" />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<ImageClassification title="AI-Powered Whiteboard" />}
          />
          <Route
            path="/imageclass"
            element={<ImageClassification title="AI-Powered Whiteboard" />}
          />
          <Route
            path="/whiteboard"
            element={
              <>
                <div>
                  {sessionID ? (
                    <Whiteboard
                      sessionID={sessionID}
                      selectedColor={selectedColor}
                      brushSize={brushSize}
                    />
                  ) : (
                    <div>
                      <button onClick={handleCreateSession}>
                        Create New Session
                      </button>
                      <br />
                      <input
                        type="text"
                        placeholder="Enter Session ID"
                        onChange={(e) => setSessionID(e.target.value)}
                        className="input-field"
                      />
                      <button onClick={() => handleJoinSession(sessionID)}>
                        Join Session
                      </button>
                    </div>
                  )}
                </div>
                <Toolbar
                  onColorChange={handleColorChange}
                  onBrushSizeChange={handleBrushSizeChange}
                />
              </>
            }
          />
        </Routes>
        <Footer title="AI-Powered Whiteboard" />
      </div>
    </Router>
  );
};

export default App;
