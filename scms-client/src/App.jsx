import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./components/common/PrivateRoute";

// Import pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserProfile from "./pages/auth/UserProfile";

import Dashboard from "./pages/dashboard/Dashboard";
import Messages from "./pages/dashboard/Messages";
import Support from "./pages/dashboard/Support";

import MemberDirectory from "./pages/members/MemberDirectory";
import MemberRegistration from "./pages/members/MemberRegistration";
import MemberProfile from "./pages/members/MemberProfile";
import SavingsOverview from "./pages/savings/SavingsOverview";
import SavingsOperations from "./pages/savings/SavingsOperations";
import SavingsProducts from "./pages/savings/SavingsProducts";
import LoanApplication from "./pages/loans/LoanApplication";
import LoanPortfolio from "./pages/loans/LoanPortfolio";
import LoanRequests from "./pages/loans/LoanRequests";
import LoanRepayment from "./pages/loans/LoanRepayment";
import TransactionHistory from "./pages/transactions/TransactionHistory";
import TransactionEntry from "./pages/transactions/TransactionEntry";
import FinancialReports from "./pages/reports/FinancialReports";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import RegistrationQueue from "./pages/admin/RegistrationQueue";
import ChartOfAccounts from "./pages/admin/ChartOfAccounts";
import InterestPosting from "./pages/admin/InterestPosting";
import TemplateManager from "./pages/admin/TemplateManager";

import WithdrawalRequest from "./pages/savings/WithdrawalRequest";
import LoanCalculator from "./pages/loans/LoanCalculator";
import LoanAppraisal from "./pages/loans/LoanAppraisal";
import CollateralRegistry from "./pages/loans/CollateralRegistry";
import FinancialStatements from "./pages/reports/FinancialStatements";
import LandingPage from "./pages/landing/LandingPage"; // New import
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Removed: <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/support" element={<Support />} />

          {/* Member Routes */}
          <Route path="/members" element={<MemberDirectory />} />
          <Route path="/members/register" element={<MemberRegistration />} />
          <Route path="/members/:id" element={<MemberProfile />} />

          {/* Savings Routes */}
          <Route path="/savings" element={<SavingsOverview />} />
          <Route path="/savings/operations" element={<SavingsOperations />} />
          <Route path="/savings/products" element={<SavingsProducts />} />
          <Route path="/savings/withdrawal" element={<WithdrawalRequest />} />

          {/* Loan Routes */}
          <Route path="/loans" element={<LoanApplication />} />
          <Route path="/loans/portfolio" element={<LoanPortfolio />} />
          <Route path="/loans/requests" element={<LoanRequests />} />
          <Route path="/loans/repayments" element={<LoanRepayment />} />
          <Route path="/loans/calculator" element={<LoanCalculator />} />
          <Route path="/loans/appraisal" element={<LoanAppraisal />} />
          <Route path="/loans/collateral" element={<CollateralRegistry />} />

          {/* Transaction Routes */}
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/transactions/entry" element={<TransactionEntry />} />

          {/* Report Routes */}
          <Route path="/reports" element={<FinancialReports />} />
          <Route path="/reports/statements" element={<FinancialStatements />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/users" replace />}
          />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/audit" element={<AuditLogs />} />
          <Route path="/admin/registrations" element={<RegistrationQueue />} />
          <Route path="/admin/coa" element={<ChartOfAccounts />} />
          <Route path="/admin/interest" element={<InterestPosting />} />
          <Route path="/admin/templates" element={<TemplateManager />} />
        </Route>
      </Route>

      {/* Catch all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
