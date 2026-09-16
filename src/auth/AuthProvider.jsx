import { createContext, useContext } from "react";
import { authClient } from "./authClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user ?? null;
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated: !!user,
        isLoading: isPending,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
