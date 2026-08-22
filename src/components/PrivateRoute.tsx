import { Navigate } from "react-router-dom";
import { hasRole, isAuthenticated } from "../auth/token";

type PrivateRouteProps = {
    children: JSX.Element;
    roles?: string[];
};

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !hasRole(roles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
