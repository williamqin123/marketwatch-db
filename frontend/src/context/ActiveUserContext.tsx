import { apiCall, PENDING, type MissingValueStatus } from "@/App";

export class FrontendUser {
  userId: string | MissingValueStatus;
  displayName: string | MissingValueStatus;
  httpCredentials: string;

  constructor(
    httpCredentials: string,
    activeUserContext,
    actionFeedbackToastsContext
  ) {
    this.userId = PENDING;
    this.displayName = PENDING;
    this.httpCredentials = httpCredentials;

    apiCall(
      activeUserContext,
      actionFeedbackToastsContext,
      {
        endpoint: "me",
        method: "GET",
        params: {
          ...(this.isAdmin() && { domain: "ADMIN" }),
        },
      },
      ({
        user_id,
        first_name: displayName,
      }: {
        user_id: string | number;
        first_name: string;
      }) => {
        this.userId = user_id.toString();
        this.displayName = displayName;
      },
      false
    );
  }

  isAdmin() {
    return Number(this.userId) === -1 || this.userId === "-1";
  }
}

// 1. Create the Context
import { createContext, useState } from "react";

interface UserContextType {
  user: FrontendUser | null;
  setUser: React.Dispatch<React.SetStateAction<FrontendUser | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

// 2. Create a Provider Component
import type { ReactNode } from "react";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null); // Example global state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
