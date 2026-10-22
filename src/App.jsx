import { Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import { useEffect } from "react";
import { useSnackbar } from "./components/SnackbarProvider";
import NotFoundPage from "./pages/public/NotFoundPage";
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
import PendingUserDetails from "./pages/staff/Users/PendingUserDetails";
import UserSearch from "./pages/staff/Users/UserSearch";
import Users from "./pages/staff/Users/Users";
import UserProfile from "./pages/staff/Users/UserProfile";
import DeactivateUser from "./pages/staff/Users/DeactivateUser";
import ManageUserAccount from "./pages/staff/Users/ManageUserAccount";
import QRBarcodeScanner from "./pages/staff/QRBarcodeScanner";
import ReturnBook from "./pages/staff/Loans/ReturnBook";
import Loans from "./pages/staff/Loans/Loans";
import Reservations from "./pages/staff/Reservations/Reservations";
import CreateReservation from "./pages/staff/Reservations/CreateReservation";
import BorrowBook from "./pages/staff/Loans/BorrowBook";
import FulfillReservation from "./pages/staff/Reservations/FulfillReservation";
import CancelReservation from "./pages/staff/Reservations/CancelReservation";
import Reports from "./pages/staff/Reports";
import Catalog from "./pages/staff/Catalog";
import BookProfile from "./pages/staff/BookProfile";
import PendingUserLanding from "./pages/staff/Users/PendingUserLanding";
import LibrarianManagement from "./pages/staff/LibrarianManagement";
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
    socket.on("snackbar", handleSnackbar);
    return () => {
      socket.off("snackbar", handleSnackbar);
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
          <Route path="*" element={<NotFoundPage />} />
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
          <Route path="/users" element={<Users />} />
          <Route path="/users/search" element={<UserSearch />} />
          <Route path="/users/manage/:id" element={<ManageUserAccount />} />
          <Route path="/users/deactivation" element={<DeactivateUser />} />
          <Route path="/users/pending" element={<PendingUserLanding />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:bookId" element={<BookProfile />} />
          <Route path="/loans/borrow" element={<BorrowBook />} />
          <Route path="/loans/return" element={<ReturnBook />} />
          <Route path="/scanner" element={<QRBarcodeScanner />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/create" element={<CreateReservation />} />
          <Route
            path="/reservations/fulfill"
            element={<FulfillReservation />}
          />
          <Route path="/reservations/cancel" element={<CancelReservation />} />
          <Route
            path="/pendingUserDetails/:id"
            element={<PendingUserDetails />}
          />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/librarianManagement"
            element={<LibrarianManagement />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
