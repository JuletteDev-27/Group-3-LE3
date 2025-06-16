import { createContext, useContext } from "react";

export const UserDataContext = createContext(undefined);

export function useUserData() {
  const userData = useContext(UserDataContext);

  if (userData === undefined) {
    throw new Error("useUserData must be used within a UserDataContext.Provider");
  }

  return userData;
}