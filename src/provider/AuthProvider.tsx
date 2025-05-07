import type { AuthInfo, User } from "@/lib/type";
import { createContext, useState, type ReactNode } from "react";


export const AuthContext = createContext<AuthInfo | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const Logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null)
        setRefreshToken(null)
        window.location.href = '/login';
    }


    const authInfo: AuthInfo = {
        user,
        loading,
        setLoading,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        Logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider