import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/token";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
