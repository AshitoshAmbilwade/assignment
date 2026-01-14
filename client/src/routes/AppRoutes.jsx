import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Gigs from "../pages/Gigs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import GigDetails from "../pages/GigDetails";
import PostGig from "../pages/PostGig";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes (only for non-auth users) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Gigs />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/post-gig" element={<PostGig />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export default AppRoutes;
