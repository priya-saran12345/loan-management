// src/App.jsx
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import LoanCalculator from './pages/LoanCalculator';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
// Employee
import AddEmployee from './pages/dashboard/AddEmployee';
import EmployeeList from './pages/dashboard/EmployeeList';
import ExpenseTracker from './pages/dashboard/ExpenseTracker';
// Customer STL
import AddCustomer from './pages/dashboard/AddCustomer';
import CustomerList from './pages/dashboard/CustomerList';
import CustomerDetails from './pages/dashboard/CustomerDetails';
import EditCustomer from './pages/dashboard/EditCustomer';
import CollectPayment from './pages/dashboard/CollectPayment';

// Customer LRA
import AddLRACustomer from './pages/dashboard/AddLRACustomer';
import CustomerListLRA from './pages/dashboard/CustomerListLRA';
import CustomerDetailsLRA from './pages/dashboard/CustomerDetailsLRA';
import EditCustomerLRA from './pages/dashboard/EditCustomerLRA';
import CollectPaymentLRA from './pages/dashboard/CollectPaymentLRA';

// Both STL or LRA 
import Wallet from './pages/dashboard/Wallet';
import ExtraIncome from './pages/dashboard/ExtraIncome';
import OverduePayments from './pages/dashboard/OverduePayments';

// Page Not Found
import PageNotFound from './pages/PageNotFound';

const App = () => {

  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">

      {!isDashboardRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/calculator' element={<LoanCalculator />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/term' element={<TermsOfService />} />
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path='profile' element={<ProfilePage />} />

            {/* Employee */}
            <Route path='add-employee' element={<AddEmployee />} />
            <Route path='employees' element={<EmployeeList />} />
            <Route path='expense-tracker' element={<ExpenseTracker />} />

            {/* STL Customer Routes */}
            <Route path='add-customer-stl' element={<AddCustomer />} />
            <Route path='customers-stl' element={<CustomerList />} />
            <Route path='customer-details-stl/:id' element={<CustomerDetails />} />
            <Route path="edit-customer-stl/:id" element={<EditCustomer />} />
            <Route path='collect-payment-stl' element={<CollectPayment />} />

            {/* LRA Customer Routes */}
            <Route path='add-customer-lra' element={<AddLRACustomer />} />
            <Route path='customers-lra' element={<CustomerListLRA />} />
            <Route path='customer-details-lra/:id' element={<CustomerDetailsLRA />} />
            <Route path="edit-customer-lra/:id" element={<EditCustomerLRA />} />
            <Route path='collect-payment-lra' element={<CollectPaymentLRA />} />

            {/* Both STL or LRA */}
            <Route path='wallet' element={<Wallet />} />
            <Route path='extra-income' element={<ExtraIncome />} />
            <Route path='overdue' element={<OverduePayments />} />

          </Route>

          {/* Page Not Found Routes */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#047857',
            border: '1px solid #059669',
          },
          error: {
            style: {
              background: '#fff',
              color: '#dc2626',
              border: '1px solid #ef4444',
            },
          },
        }}
      />
    </div>
  );
};

export default App;