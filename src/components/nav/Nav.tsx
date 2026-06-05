import { NavLink } from 'react-router';
import './nav.css';
import bulsu from '../../assets/univlogo/bulsu_logo.svg';
import cict from '../../assets/univlogo/cict_logo.svg';
import arrow_primary from '../../assets/designs/arrow_primary.svg';
import { IconLayoutDashboard, IconClipboardList, IconChartColumn, IconTransform, IconChecklist, IconUsers, IconSettings2, IconCalendarWeek, IconLogout2 } from '@tabler/icons-react';
import type { JSX } from 'react/jsx-dev-runtime';

export default function Nav(){

    const navLink: { name: string; to: string; icon: JSX.Element }[] = [       
        {name: 'Dashboard', to: 'dashboard', icon: <IconLayoutDashboard size={20} /> },
        {name: 'PPMP Master List', to: 'ppmp-master-list', icon: <IconClipboardList size={20} /> },
        {name: 'Procurement Monitor', to: 'procurement-monitor', icon: <IconChartColumn size={20} /> },
        {name: 'In Lieu Reallocation', to: 'in-lieu-reallocation', icon: <IconTransform size={20} /> },
        {name: 'In Lieu Approvals', to: 'in-lieu-approvals', icon: <IconChecklist size={20} /> },
        {name: 'User Management', to: 'user-management', icon: <IconUsers size={20} /> },
        {name: 'Settings', to: 'settings', icon: <IconSettings2 size={20} /> },
    ]


    return (
        <nav className="nav-container">
            <div className="header">
                <div className="univ-logos">
                    <img src={bulsu} alt="BULSU Logo" />
                    <img src={cict} alt="CICT Logo" />
                </div>
                <div className="hero-text">
                    <h1><span>CICT - </span><span>PPMP</span></h1>
                    <img src={arrow_primary} alt="Arrow Icon" />
                    <p>Bulacan State University</p>
                </div>
            </div>
            <hr />
            <div className="fiscal-year-selector-container">
                <label htmlFor="fiscal-year">
                    <IconCalendarWeek size={24} />
                    Fiscal Year:
                </label>
                <select name="fiscal-year" id="fiscal-year">
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                </select>
            </div>
            <hr />
            <div className="nav-links">
                {navLink.map((link, index) => (
                    <NavLink 
                        key={index} 
                        to={link.to} 
                        className="nav-link">
                        {link.icon}
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </div>
            <hr />
            <button className="logout-button">
                <IconLogout2 size={24} />
                Logout
            </button>
        </nav>
    )
}