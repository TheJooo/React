// src/context/UserContext.tsx
import { createContext, useState, ReactNode } from "react";
export type AuthUser = { username: string, password: string } | { cpf: string; name: string };

interface UserContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
