"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ResetContext = createContext();

export function ResetProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmailState] = useState(null);
  const [resetToken, setResetTokenState] = useState(null);

  // Load userEmail from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetUserEmail");
    if (storedEmail) {
      setUserEmailState(storedEmail);
    }
    const storedToken = localStorage.getItem("resetToken");
    if (storedToken) {
      setResetTokenState(storedToken);
    }
  }, []);

  // Setter function that syncs with localStorage
  const setUserEmail = (email) => {
    console.log("setUserEmail", email);
    if (email) {
      localStorage.setItem("resetUserEmail", email);
      setUserEmailState(email);
    } else {
      removeUserEmail();
    }
  };
  const setResetToken = (token) => {
    console.log("setResetToken", token);
    if (token) {
      localStorage.setItem("resetToken", token);
      setResetTokenState(token);
    } else {
      removeResetToken();
    }
  };

  // Function to remove userEmail from both state & storage
  const removeUserEmail = () => {
    localStorage.removeItem("resetUserEmail");
    setUserEmailState(null);
  };
  const removeResetToken = () => {
    localStorage.removeItem("resetToken");
    setResetTokenState(null);
  };

  return (
    <ResetContext.Provider
      value={{
        userId,
        setUserId,
        userEmail,
        setUserEmail,
        removeUserEmail,
        resetToken,
        setResetToken,
      }}
    >
      {children}
    </ResetContext.Provider>
  );
}

export const useReset = () => {
  return useContext(ResetContext);
};
