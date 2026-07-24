import { NavLink, useNavigate } from 'react-router';
import './nav.css';
import bulsu from '../../assets/univlogo/bulsu_logo.svg';
import cict from '../../assets/univlogo/cict_logo.svg';
import arrow_secondary from '../../assets/designs/arrow_secondary.svg';
import { IconLayoutDashboard, IconClipboardList, IconChartColumn, IconTransform, IconChecklist, IconUsers, IconSettings2, IconCalendarWeek, IconLogout2 } from '@tabler/icons-react';
import type { JSX } from 'react/jsx-dev-runtime';
import { getAccessToken, logoutUser } from "../../../supadb"
import { toast } from '../toast/ToastService.js';
import { showCircleLoadingDialog } from '../dialogs/circle_loading_dialog/CircleLoadingDialogService';

interface NavItem {
    name: string;
    to: string;
    icon: JSX.Element;
    description?: string;
}

interface NavProps {
    userRole: string;
    selectedFiscalYear: string;
    fiscalYears: string[];
    handleFiscalYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Nav({ userRole, selectedFiscalYear, fiscalYears, handleFiscalYearChange }: NavProps) {

    const navLink: NavItem[] = [       
        {name: 'Dashboard', to: 'dashboard', icon: <IconLayoutDashboard size={20} />},
        {name: 'PPMP Master List', to: 'ppmp-master-list', icon: <IconClipboardList size={20} /> },
        {name: 'Procurement Monitor', to: 'procurement-monitor', icon: <IconChartColumn size={20} />},
        {name: 'In Lieu Reallocation', to: 'in-lieu-reallocation', icon: <IconTransform size={20} /> },
        {name: 'In Lieu Approvals', to: 'in-lieu-approvals', icon: <IconChecklist size={20} /> },
        {name: 'Settings', to: 'settings', icon: <IconSettings2 size={20} />},
    ]

    const adminNavLink: NavItem[] = [       
        {name: 'Dashboard', to: 'dashboard', icon: <IconLayoutDashboard size={20} />},
        {name: 'PPMP Master List', to: 'ppmp-master-list', icon: <IconClipboardList size={20} /> },
        {name: 'Procurement Monitor', to: 'procurement-monitor', icon: <IconChartColumn size={20} />},
        {name: 'In Lieu Reallocation', to: 'in-lieu-reallocation', icon: <IconTransform size={20} /> },
        {name: 'In Lieu Approvals', to: 'in-lieu-approvals', icon: <IconChecklist size={20} /> },
        {name: 'User Management', to: 'user-management', icon: <IconUsers size={20} /> },
        {name: 'Settings', to: 'settings', icon: <IconSettings2 size={20} />},
    ]

    const navigate = useNavigate();

    async function handleLogout() { 
        const closeLoading = showCircleLoadingDialog();

        try {
            await logoutUser();
            navigate('/login');
            toast.success("Logged out successfully.");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Network error. Please try again later.");
        } finally {
            closeLoading();
        }
    }

    async function checkAccess(){
        const accessToken = await getAccessToken();
        if(!accessToken){
            navigate('/login');
            toast.error("User not logged in. Please log in again.");
        }
    }

    return (
        <nav className="nav-container">
            <div className="header">
                <div className="univ-logos">
                    <img src={bulsu} alt="BULSU Logo" />
                    <img src={cict} alt="CICT Logo" />
                </div>
                <div className="hero-text">
                    <h1><span>CICT - </span><span>PPMP</span></h1>
                    <img src={arrow_secondary} alt="Arrow Icon" />
                    <p>Bulacan State University</p>
                </div>
            </div>
            <hr />
            <div className="fiscal-year-selector-container">
                <label htmlFor="fiscal-year">
                    <IconCalendarWeek size={24} />
                    Fiscal Year:
                </label>
                <select name="fiscal-year" id="fiscal-year" value={selectedFiscalYear} onChange={handleFiscalYearChange}>
                    {fiscalYears.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <hr />
            <div className="nav-links">
                {(userRole === 'Admin' ? adminNavLink : navLink).map((link, index) => (
                    <NavLink 
                        key={index} 
                        to={link.to} 
                        className="nav-link"
                        onClick={checkAccess}>
                        {link.icon}
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </div>
            <hr />
            <button className="btn-solid red" onClick={handleLogout}>
                <IconLogout2 size={24} />
                Logout
            </button>
        </nav>
    )
}