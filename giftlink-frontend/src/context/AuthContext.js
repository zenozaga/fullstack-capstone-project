import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * @typedef {{
 *  token: string,
 *  name: string,
 *  email: string
 * }} AuthState
 */

/**
 *
 * @type {React.Context<{
 * isLoggedIn: boolean,
 * setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
 * state: AuthState,
 * logout: () => void
 * login: (name: string, email: string, token: string) => void
 * }>}
 *
 */
const AppContext = createContext();

function saveCredentials(name, email, token) {
  const data = { name, email, token };
  sessionStorage.setItem("auth-credentials", JSON.stringify(data));
}

/**
 *
 * @returns {AuthState | null}
 */
function getCredentials() {
  try {
    const data = sessionStorage.getItem("auth-credentials");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(/** @type {AuthState} */ ({}));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const credentials = getCredentials();
    if (!credentials) return;


    if (credentials.token) {
      setState((prevState) => ({ ...prevState, ...credentials }));
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("auth-credentials");
    setIsLoggedIn(false);
    setState({});
  };

  const login = (name, email, token) => {
    saveCredentials(name, email, token);
    setState((prevState) => ({ ...prevState, name, email, token }));
    setIsLoggedIn(true);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        state,
        logout,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
