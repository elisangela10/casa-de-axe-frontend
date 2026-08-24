import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, hasRole, hasUserRole, isAuthenticated, type AuthUser } from "../auth/token";
import { getCurrentUserProfile } from "../services/userService";

type PrivateRouteProps = {
    children: JSX.Element;
    roles?: string[];
};

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
    const [checkingRole, setCheckingRole] = useState(Boolean(roles));
    const [allowed, setAllowed] = useState(!roles);
    const [profile, setProfile] = useState<AuthUser | null>(getCurrentUser());

    useEffect(() => {
        if (!roles || !isAuthenticated()) return;
        if (hasRole(roles)) {
            setCheckingRole(false);
            setAllowed(true);
            return;
        }

        let active = true;
        void getCurrentUserProfile().then((serviceProfile) => {
            if (!active) return;
            if (serviceProfile) setProfile(serviceProfile);
            setAllowed(hasUserRole(serviceProfile, roles));
            setCheckingRole(false);
        }).catch(() => {
            if (active) {
                setAllowed(false);
                setCheckingRole(false);
            }
        });
        return () => { active = false; };
    }, [roles]);

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (roles && checkingRole) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">Verificando permissões...</div>;
    }

    if (roles && !allowed && !hasUserRole(profile, roles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
