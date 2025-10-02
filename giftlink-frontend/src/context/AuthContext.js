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

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(/** @type {AuthState} */ ({}));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    const name = sessionStorage.getItem("user-name");
    const email = sessionStorage.getItem("user-email");

    if (token) {
      setState((prevState) => ({ ...prevState, token, name, email }));
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("user-name");
    sessionStorage.removeItem("user-email");
    setIsLoggedIn(false);
    setState({});
  };

  const login = (name, email, token) => {
    sessionStorage.setItem("auth-token", token);
    sessionStorage.setItem("user-name", name);
    sessionStorage.setItem("user-email", email);
    setIsLoggedIn(true);
    setState((prevState) => ({ ...prevState, name, email, token }));
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
