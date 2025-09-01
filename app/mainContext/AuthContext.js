"use client";
import { logoutSession } from "@/DAL/signin";
import { setCookie, deleteCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sessionInfo");
      return stored
        ? JSON.parse(stored)
        : {
            company_id: null,
            user_id: null,
            context: null,
            name: null,
            username: null,
            user_companies: null,
          };
    }
    // Default value for SSR
    return {
      company_id: null,
      user_id: null,
      context: null,
      name: null,
      username: null,
      user_companies: null,
    };
  });

  const [authenticated, setAuthenticated] = useState(null);
  const handleAuthentication = (status) => {
    setAuthenticated(status);
    localStorage.setItem("authenticated", status.toString());
  };
  const handleLogout = async () => {
    try {
      handleAuthentication(false);
      setSessionInfo(null);
      localStorage.removeItem("authenticated");
      deleteCookie("authenticated");
      await logoutSession();
    } catch (error) {
      handleAuthentication(false);
      setSessionInfo(null);
      localStorage.removeItem("authenticated");
      deleteCookie("authenticated");

      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    localStorage.setItem("sessionInfo", JSON.stringify(sessionInfo));
  }, [sessionInfo]);
  return (
    <AuthContext.Provider
      value={{
        setSessionInfo,
        sessionInfo,
        authenticated,
        handleAuthentication,
        handleLogout,
        // handleCheckSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easier usage
export const useAuth = () => {
  return useContext(AuthContext);
};
