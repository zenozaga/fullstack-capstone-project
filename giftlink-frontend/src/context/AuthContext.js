import React, { createContext, useState, useContext, useEffect } from "react";


/**
 * 
 * @type {React.Context<{
 * isLoggedIn: boolean,
 * setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
 * userName: string,
 * setUserName: React.Dispatch<React.SetStateAction<string>>
 * }>}
 * 
 */
const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    const name = sessionStorage.getItem("user-name");
    if (token) {
      setIsLoggedIn(true);
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
