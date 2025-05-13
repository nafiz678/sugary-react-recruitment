import { checkAuth } from "@/authentication/newAxiosInterceptor";
import type { AuthInfo, User } from "@/lib/type";
import { createContext, useState, useEffect, type ReactNode } from 'react';


export const AuthContext = createContext<AuthInfo | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const Logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessExpiry");
        localStorage.removeItem("refreshExpiry");
        localStorage.clear()
        window.location.href = '/login';
    }


    // Check authentication status on mount and when tokens change
    useEffect(() => {
        const validateAuth = async () => {
            setLoading(true);
            try {
                // Check if user is authenticated
                const isValid = await checkAuth();
                console.log(isValid)
                if (isValid) {
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth validation error:', error);
                setUser(null);
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
                console.log(isAuthenticated)
            }
        };

        validateAuth();
    }, [isAuthenticated]);


    // Listen for storage events (for multi-tab support)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken' || e.key === 'refreshToken') {
                window.location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    const authInfo: AuthInfo = {
        user,
        loading,
        setLoading,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        Logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider