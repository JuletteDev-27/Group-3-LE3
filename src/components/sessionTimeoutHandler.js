import { useNavigate } from "react-router-dom";

let sessionTimeoutId;
const SESSION_TIMEOUT_MS = 60 * 1000; 

export const logoutDueToInactivity = (navigate) => {
  sessionStorage.clear();
  alert("You have been logged out due to inactivity.");
  navigate("/");
};

export const startSessionTimeout = (navigate) => {
  stopSessionTimeout();
  sessionTimeoutId = setTimeout(() => {
    logoutDueToInactivity(navigate);
  }, SESSION_TIMEOUT_MS);
};

export const stopSessionTimeout = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
};

export const initUserActivityMonitor = (navigate) => {
  const resetTimer = () => startSessionTimeout(navigate);
  const events = ["mousemove", "keydown", "click", "scroll"];

  events.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  startSessionTimeout(navigate);

  return () => {
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
    stopSessionTimeout();
  };
};

export const RedirectIfNoToken = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = retrieveSessionToken();
            if (token === null) {
                navigate("/");
            }
        };

        checkToken(); 

        const retrieveInterval = setInterval(checkToken, 5000); 

        return () => {
            clearInterval(retrieveInterval); 
        };
    }, [navigate]); 
};

export const retrieveSessionToken = () => {
  try {
    const sessionToken = sessionStorage.getItem("sessionToken");
    return sessionToken ? JSON.parse(sessionToken).userBearerToken : null;
  } catch {
    return null;
  }
};


export function setSessionToken(token){
    const now = new Date()

    const userBearerToken = {
        userBearerToken: token
    }
    
    sessionStorage.setItem("sessionToken", JSON.stringify(userBearerToken))
}

export function logOut(navigate) {
  sessionStorage.clear();
  navigate("/"); 
}
