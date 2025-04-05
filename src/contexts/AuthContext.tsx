import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  id?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get token from localStorage
const getToken = (): string | null => localStorage.getItem('authToken');

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());

  // Initialize user state from localStorage if token exists
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Optional: Fetch user data using the token if not in localStorage
        // Or clear token if user data is essential and missing
        console.warn('Token found but user data missing in localStorage.');
        logout(); // Example: Logout if user data is missing
      }
    } else {
      setUser(null); // Ensure user is null if no token
    }
  }, [token]);

  // Re-check localStorage on mount in case it changed in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getToken());
    };
    window.addEventListener('storage', handleStorageChange);
    // Initial check in case state is stale
    setToken(getToken());
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('authToken', receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(receivedToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Derive isAuthenticated from the presence of the token
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
