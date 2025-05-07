import Loader from '@/components/Loader'
import { AuthContext } from '@/provider/AuthProvider'
import { useContext, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const context = useContext(AuthContext)
    const location = useLocation()
    const loading = context?.loading

    if (!context) {
        throw new Error('PrivateRoute must be used ');
    }
    const getAccessToken = () => localStorage.getItem('accessToken');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    
    if (loading) return <div className="flex items-center justify-center gap-3 h-screen"><Loader /> </div>
    if (getAccessToken() && getRefreshToken()) return children
    return <Navigate to='/login' state={{ from: location }} replace={true} />
}


export default PrivateRoute
