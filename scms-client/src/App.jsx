import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./shared/components/common/PrivateRoute";

// Import pages
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import UserProfile from "./features/auth/pages/UserProfile";
import ResetPassword from "./features/auth/pages/ResetPassword";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Onboarding from "./features/auth/pages/Onboarding";
import PendingApproval from "./features/auth/pages/PendingApproval";

import Dashboard from "./features/dashboard/pages/Dashboard";
import Messages from "./features/dashboard/pages/Messages";
import Support from "./features/dashboard/pages/Support";

import MemberProfile from "./features/members/pages/MemberProfile";
import SavingsOverview from "./features/savings/pages/SavingsOverview";
import SavingsOperations from "./features/savings/pages/SavingsOperations";
import SavingsProducts from "./features/savings/pages/SavingsProducts";
import LoanApplication from "./features/loans/pages/LoanApplication";
import LoanPortfolio from "./features/loans/pages/LoanPortfolio";
import LoanRequests from "./features/loans/pages/LoanRequests";
import LoanRepayment from "./features/loans/pages/LoanRepayment";
import TransactionHistory from "./features/transactions/pages/TransactionHistory";
import TransactionEntry from "./features/transactions/pages/TransactionEntry";
import FinancialReports from "./features/reports/pages/FinancialReports";
import UserManagement from "./features/admin/pages/UserManagement";
import SystemSettings from "./features/admin/pages/SystemSettings";
import AuditLogs from "./features/admin/pages/AuditLogs";
import RegistrationQueue from "./features/admin/pages/RegistrationQueue";
import ChartOfAccounts from "./features/admin/pages/ChartOfAccounts";
import InterestPosting from "./features/admin/pages/InterestPosting";
import TemplateManager from "./features/admin/pages/TemplateManager";
import WithdrawalQueue from "./features/admin/pages/WithdrawalQueue";
import LoanDisbursement from "./features/admin/pages/LoanDisbursement";
import LoanRepaymentLedger from "./features/loans/pages/LoanRepaymentLedger";
import InterAccountTransfer from "./features/transactions/pages/InterAccountTransfer";
import BalanceSheet from "./features/admin/pages/BalanceSheet";
import IncomeStatement from "./features/admin/pages/IncomeStatement";

import WithdrawalRequest from "./features/savings/pages/WithdrawalRequest";
import LoanCalculator from "./features/loans/pages/LoanCalculator";
import LoanAppraisal from "./features/loans/pages/LoanAppraisal";
import CollateralRegistry from "./features/loans/pages/CollateralRegistry";
import FinancialStatements from "./features/reports/pages/FinancialStatements";
import LandingPage from "./features/landing/pages/LandingPage";
import SavingsDetails from "./features/savings/pages/SavingsDetails";
import NotFound from "./features/NotFound";

import React, { useEffect } from "react";
import { useAuth } from "./features/auth/hooks/useAuth";
import { setNavigate } from "./lib/api";
import { useNavigate } from "react-router-dom";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  if (isLoading) return null; // Or a loading spinner

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
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* Focused Onboarding Pages (No Sidebar/Header) */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<MainLayout />}>
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/support" element={<Support />} />

          {/* Member & Admin Management (Admin/Staff only) */}
          <Route
            element={<PrivateRoute allowedRoles={["super_admin", "staff"]} />}
          >
            {/* Redirect /members to /admin/users */}
            <Route
              path="/members"
              element={<Navigate to="/admin/users" replace />}
            />
            <Route
              path="/members/:id"
              element={<Navigate to="/admin/users/:id" replace />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/users" replace />}
            />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/users/:id" element={<MemberProfile />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            <Route
              path="/admin/registrations"
              element={<RegistrationQueue />}
            />
            <Route path="/admin/coa" element={<ChartOfAccounts />} />
            <Route path="/admin/interest" element={<InterestPosting />} />
            <Route path="/admin/templates" element={<TemplateManager />} />
            <Route path="/admin/withdrawals" element={<WithdrawalQueue />} />
            <Route path="/admin/disbursements" element={<LoanDisbursement />} />
          </Route>

          {/* Savings Routes */}
          <Route path="/savings" element={<SavingsOverview />} />
          <Route path="/savings/operations" element={<SavingsOperations />} />
          <Route path="/savings/products" element={<SavingsProducts />} />
          <Route path="/savings/plans/:id" element={<SavingsDetails />} />
          <Route path="/savings/withdrawal" element={<WithdrawalRequest />} />

          {/* Loan Routes */}
          <Route path="/loans" element={<LoanApplication />} />
          <Route path="/loans/portfolio" element={<LoanPortfolio />} />
          <Route path="/loans/requests" element={<LoanRequests />} />
          <Route path="/loans/repayments" element={<LoanRepayment />} />
          <Route path="/loans/calculator" element={<LoanCalculator />} />
          <Route path="/loans/appraisal" element={<LoanAppraisal />} />
          <Route path="/loans/collateral" element={<CollateralRegistry />} />
          <Route path="/loans/:id/ledger" element={<LoanRepaymentLedger />} />

          {/* Transaction Routes */}
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route
            path="/transactions/transfer"
            element={<InterAccountTransfer />}
          />
          <Route path="/transactions/entry" element={<TransactionEntry />} />

          {/* Report Routes */}
          <Route path="/reports" element={<FinancialReports />} />
          <Route path="/reports/statements" element={<FinancialStatements />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
          <Route
            path="/reports/income-statement"
            element={<IncomeStatement />}
          />
        </Route>
      </Route>

      {/* Catch all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

import { ConfirmationProvider } from "./contexts/ConfirmationContext";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <ConfirmationProvider>
        <AppRoutes />
      </ConfirmationProvider>
    </Router>
  );
};

export default App;
