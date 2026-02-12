import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import UserRequest from "./pages/UserRequest";
import UserDashboard from "./pages/UserDashboard";
import ViewMyQR from "./pages/ViewMyQR";
import MyProfile from "./pages/MyProfile";
import AllQRs from "./pages/AllQRs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/user/request" element={<UserRequest />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/viewqr" element={<ViewMyQR />} />
          <Route path="/user/profile" element={<MyProfile />} />
          <Route path="/user/allqrs" element={<AllQRs />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
