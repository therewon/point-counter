import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import GameModePage from "./pages/GameModePage";
import MainLayout from "./layout/MainLayout";
import MultiplayerLobby from "./pages/MultiplayerLobby";
import MultiplayerRoom from "./pages/MultiplayerRoom";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <GameModePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/offline",
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
      },
      {
        path: "/multiplayer",
        element: (
          <ProtectedRoute>
            <MultiplayerLobby />
          </ProtectedRoute>
        ),
      },
      {
        path: "/room/:roomCode",
        element: (
          <ProtectedRoute>
            <MultiplayerRoom />
          </ProtectedRoute>
        ),
      },
      {
        path: "/privacy-and-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
