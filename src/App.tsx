import { BrowserRouter, Routes, Route, useLocation, matchPath } from 'react-router';
import './App.css'
import { useState } from 'react';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import ForgotPassword from './pages/login/ForgotPassword';
import ResetPassword from './pages/login/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Nav from './components/nav/Nav';
import Header from './components/header/Header';
import PpmpMasterlist from './pages/masterlist/PpmpMasterlist';
import ProcurementMonitor from './pages/monitoring/ProcurementMonitor';
import InLieuReallocation from './pages/reallocation/InLieuReallocation';
import InLieuApprovals from './pages/approvals/InLieuApprovals';
import UserManagement from './pages/usermanagement/UserManagement';
import Settings from './pages/settings/Settings';

function App() {

  return (
    <>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </>
  )
}

function AppWrapper() {

  const location = useLocation()
  const noNavPaths = ['/', '/login', '/forgot-password', '/reset-password'];
  const hideNav = noNavPaths.some(path => matchPath(path, location.pathname));
  const fiscalYears= [2022, 2023, 2024, 2025];
  const currentFiscalYear = 2022;
  const role = 'admin'; // Replace with the actual role of the user
  const userFullName = 'Jerson Patrick Valdez'; // Replace with the actual full name of the user
  const userEmailAddress = '@jerson@gmail.com'; // Replace with the actual email address of the user
  return(
    <>
      {!hideNav && (
        <>
          <Nav userRole={role} fiscalYear={fiscalYears} />
          <Header userFullName={userFullName} userEmailAddress={userEmailAddress} />
        </>
      )}
        <Routes>
          <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ppmp-master-list" element={<PpmpMasterlist />} />
            <Route path="/procurement-monitor" element={<ProcurementMonitor />} />
            <Route path="/in-lieu-reallocation" element={<InLieuReallocation />} />
            <Route path="/in-lieu-approvals" element={<InLieuApprovals />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    </>
  )
}

export default App
