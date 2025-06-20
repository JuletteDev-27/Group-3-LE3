import { Navigate, useNavigate } from "react-router-dom";
import { retrieveSessionToken, initUserActivityMonitor } from "./sessionTimeoutHandler";
import { useEffect } from "react";

export const SessionGuard = ({ children }) => {
  const token = retrieveSessionToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      initUserActivityMonitor(navigate);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};