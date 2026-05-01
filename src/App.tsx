/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Photographers } from "./pages/Photographers";
import { Profile } from "./pages/Profile";
import { Education } from "./pages/Education";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Booking } from "./pages/Booking";
import { EditProfile } from "./pages/EditProfile";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="photographers" element={<Photographers />} />
        <Route path="photographers/:id" element={<Profile />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="education" element={<Education />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/edit-profile" element={<EditProfile />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
