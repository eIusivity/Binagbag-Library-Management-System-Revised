import { Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import { useEffect } from "react";
import { useSnackbar } from "./components/SnackbarProvider";
import PublicLayout from "./layout/PublicLayout";
import StaffLayout from "./layout/StaffLayout";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import BooksEncode from "./pages/staff/BooksEncode";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import Dashboard from "./pages/staff/Dashboard";
import Home from "./pages/public/Home";
import LandingPage from "./pages/public/LandingPage";
function App() {
  const { triggerSnackbar } = useSnackbar();
  useEffect(() => {
    function handleSnackbar(notification) {
      triggerSnackbar({
        title: notification.title,
        content: notification.content,
        severity: notification.severity,
        action: notification.action,
      });
    }
    socket.on("new-registration", handleSnackbar);
    return () => {
      socket.off("new-registration", handleSnackbar);
    };
  }, [triggerSnackbar]);
  return (
    <>
      <Routes>
        {/* Guests only */}
        <Route
          element={
            <GuestRoute>
              <PublicLayout />
            </GuestRoute>
          }
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Patron */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Patron"]}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Staff */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Librarian", "Administrator"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/encodebook" element={<BooksEncode />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
