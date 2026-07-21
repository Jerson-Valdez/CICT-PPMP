import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router';
import { useEffect, useState, lazy, Suspense } from 'react';
import { FourSquare } from 'react-loading-indicators';
import './App.css';

// Pages
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import ForgotPassword from './pages/login/ForgotPassword';
import ResetPassword from './pages/login/ResetPassword';

//for lazy loading
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const PpmpMasterlist = lazy(() => import('./pages/masterlist/PpmpMasterlist'));
const ProcurementMonitor = lazy(() => import('./pages/monitoring/ProcurementMonitor'));
const InLieuReallocation = lazy(() => import('./pages/reallocation/InLieuReallocation'));
const InLieuApprovals = lazy(() => import('./pages/approvals/InLieuApprovals'));
const UserManagement = lazy(() => import('./pages/usermanagement/UserManagement'));
const Settings = lazy(() => import('./pages/settings/Settings'));

// Components
import Nav from './components/nav/Nav';
import Header from './components/header/Header';
import { getAccessToken } from '../supadb';
import { toast } from './components/toast/ToastService';

function PrivateLayout() {
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    const [fiscalYears, setFiscalYears] = useState<string[]>([]);
    const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>(new Date().getFullYear().toString());
    const [userFullName, setUserFullName] = useState<string>('');
    const [userEmailAddress, setUserEmailAddress] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [deanName, setDeanName] = useState<string>('');
    const [prAsignatories, setPrAsignatories] = useState<{ [key: string]: string }>({});
    const [approvedAsignatories, setApprovedAsignatories] = useState<{ [key: string]: string }>({});
    const [revisedAsignatories, setRevisedAsignatories] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchInitialData = async () => {
            const accessToken = await getAccessToken();
            
            if (!accessToken) {
                toast.error("User not logged in. Please log in again.");
                navigate('/login');
                return;
            }

            try {
                const formDataPr = new FormData();
                const formDataApproved = new FormData();
                const formDataRevised = new FormData();

                formDataPr.append('documentType', "PURCHASE REQUEST");
                formDataApproved.append('documentType', "APPROVED PPMP");
                formDataRevised.append('documentType', "REVISED PPMP");

                const [fiscalResponse, headerResponse, deanNameResponse, prAsignatoriesResponse, approvedAsignatoriesResponse, revisedAsignatoriesResponse] = await Promise.all([
                    fetch("https://test-ppmp.onrender.com/api/fiscal_years/", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    fetch("https://test-ppmp.onrender.com/api/user/header_info/", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    fetch("https://test-ppmp.onrender.com/api/user/admin_name/", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    fetch("https://test-ppmp.onrender.com/api/signatories/", {
                        method: "POST",
                        body: formDataPr,
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    fetch("https://test-ppmp.onrender.com/api/signatories/", {
                        method: "POST",
                        body: formDataApproved,
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    fetch("https://test-ppmp.onrender.com/api/signatories/", {
                        method: "POST",
                        body: formDataRevised,
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })

                ]);

                if (!fiscalResponse.ok) {
                    toast.error("Failed to retrieve fiscal years.");
                    return;
                } else {
                    const fiscalResult = await fiscalResponse.json();
                    console.log("Fiscal years retrieved: ", fiscalResult);
                    
                    const extractedYears = fiscalResult.map((item: any) => item.Year);
                    const sortedYears = extractedYears.sort((a: string, b: string) => b.localeCompare(a));
                    setSelectedFiscalYear(sortedYears[0]);
                    setFiscalYears(sortedYears);
                }

                if (!headerResponse.ok) {
                    toast.error("Failed to retrieve header info.");
                    return; 
                } else {
                    const headerResult = await headerResponse.json();
                    console.log("Header info retrieved: ", headerResult);
                    setUserFullName(headerResult.UserFullName);
                    setUserEmailAddress(headerResult.UserEmailAddress);
                    setUserRole(headerResult.UserRole);
                }

                if (!deanNameResponse.ok) {
                    toast.error("Failed to retrieve dean name.");
                    return;
                } else {
                    const deanNameResult = await deanNameResponse.json();
                    console.log("Dean name retrieved: ", deanNameResult);
                    setDeanName(deanNameResult.fullname);
                }

                if (!prAsignatoriesResponse.ok) {
                    toast.error("Failed to retrieve asignatories.");
                    return;
                } else {
                    const asignatoriesResult = await prAsignatoriesResponse.json();
                    console.log("Asignatories retrieved: ", asignatoriesResult.signatories);
                    setPrAsignatories(asignatoriesResult.signatories);
                }

                if (!approvedAsignatoriesResponse.ok) {
                    toast.error("Failed to retrieve approved asignatories.");
                    return;
                }else {
                    const approvedAsignatoriesResult = await approvedAsignatoriesResponse.json();
                    console.log("Approved Asignatories retrieved: ", approvedAsignatoriesResult.signatories);
                    setApprovedAsignatories(approvedAsignatoriesResult.signatories);
                }

                if (!revisedAsignatoriesResponse.ok) {
                    toast.error("Failed to retrieve revised asignatories.");
                    return;
                }else {
                    const revisedAsignatoriesResult = await revisedAsignatoriesResponse.json();
                    console.log("Revised Asignatories retrieved: ", revisedAsignatoriesResult.signatories);
                    setRevisedAsignatories(revisedAsignatoriesResult.signatories);
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
                toast.error("Network error. Please try again later.");
            } finally {
                console.log(selectedFiscalYear);
                setIsCheckingAuth(false);
            }
        };

        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleFiscalYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newFiscalYear = event.target.value;
        setSelectedFiscalYear(newFiscalYear);
        toast.success(`Fiscal year changed to ${newFiscalYear}`);
    }

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <FourSquare color="var(--primary)" size="large" text="Loading..."/>
            </div>
        );
    }

    return (
        <>
            <Nav userRole={userRole} fiscalYears={fiscalYears} selectedFiscalYear={selectedFiscalYear} handleFiscalYearChange={handleFiscalYearChange} />
            <Header userFullName={userFullName} userEmailAddress={userEmailAddress} fiscalYears={fiscalYears} />

            <main className="main-content-wrapper">
                <Suspense fallback={
                    <div className="h-screen w-screen flex items-center justify-center">
                        <FourSquare color="var(--primary)" size="large" text="Loading page..." />
                    </div>
                }>
                    <Outlet context={{ userRole, selectedFiscalYear, userFullName, userEmailAddress, deanName, prAsignatories, approvedAsignatories, revisedAsignatories, setUserFullName }} /> 
                </Suspense>
            </main>
        </>
    );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC ROUTES (No Nav, No Header, No Auth Check) */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* PRIVATE ROUTES (Protected by PrivateLayout) kailangan naka logged in ang user */}
                <Route element={<PrivateLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ppmp-master-list" element={<PpmpMasterlist />} />
                    <Route path="/procurement-monitor" element={<ProcurementMonitor />} />
                    <Route path="/in-lieu-reallocation" element={<InLieuReallocation />} />
                    <Route path="/in-lieu-approvals" element={<InLieuApprovals />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Admin Only Route */}
                    <Route 
                        path="/user-management" 
                        element={
                            <AdminRoute>
                                <UserManagement />
                            </AdminRoute>
                        } 
                    />
                </Route>

                {/* Catch-all for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}