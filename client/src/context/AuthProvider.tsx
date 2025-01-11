import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";

interface LoginType {
  user: User;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  error: string | null;
  login: (params: LoginType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = ({ user }: LoginType) => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user), { expires: 15 });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  useEffect(() => {
    const fetchUser = () => {
      try {
        const currentUser = Cookies.get("user")
          ? JSON.parse(Cookies.get("user")!)
          : null;

        if (currentUser) {
          setUser(currentUser);
        }
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
