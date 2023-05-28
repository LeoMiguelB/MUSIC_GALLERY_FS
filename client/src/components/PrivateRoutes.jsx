import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;