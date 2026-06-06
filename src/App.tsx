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

  const [currentPageName, setCurrentPageName] = useState<string>('');
  const [currentPageDescription, setCurrentPageDescription] = useState<string>('');
  function onPageChange(pageName: string, pageDescription?: string) {
    setCurrentPageName(pageName);
    setCurrentPageDescription(pageDescription || '');
  }

  const location = useLocation()
  const noNavPaths = ['/', '/login', '/forgot-password', '/reset-password'];
  const hideNav = noNavPaths.some(path => matchPath(path, location.pathname));

  return(
    <>
      {!hideNav && (
        <>
          <Nav onPageChange={onPageChange} />
          <Header currentPageName={currentPageName} currentPageDescription={currentPageDescription} />
        </>
      )}
        <Routes>
          <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  )
}

export default App
