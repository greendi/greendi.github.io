
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { User } from "@/types/recipe";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("current-user", null);
  const [users, setUsers] = useLocalStorage<{ email: string; password: string; user: User }[]>("users", []);
  
  const register = (email: string, password: string, name?: string): boolean => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      toast.error("User with this email already exists");
      return false;
    }
    
    const newUser: User = {
      id: uuidv4(),
      email,
      name
    };
    
    setUsers([...users, { email, password, user: newUser }]);
    setUser(newUser);
    toast.success("Account created successfully!");
    return true;
  };
  
  const login = (email: string, password: string): boolean => {
    const userAccount = users.find(u => u.email === email && u.password === password);
    
    if (userAccount) {
      setUser(userAccount.user);
      toast.success("Logged in successfully!");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully!");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
