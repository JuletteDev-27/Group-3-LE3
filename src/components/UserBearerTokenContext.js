import { createContext, useContext } from "react";

export const UserBearerTokenContext = createContext(undefined);

export function useUserBearerToken() {
  const user = useContext(UserBearerTokenContext);

  if (user === undefined) {
    throw new Error("useUserBearerToken must be used within a UserBearerTokenContext.Provider");
  }

  return user;
}