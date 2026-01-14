import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

  // 🔒 WAIT until auth check finishes
  if (loading) {
    return null; // or loader
  }

  // 🔒 If user IS authenticated, block login/register
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise allow access to login/register
  return <Outlet />;
};

export default PublicRoute;
