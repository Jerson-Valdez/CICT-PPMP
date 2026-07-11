import './header.css';
import { IconUpload, IconBell, IconUser } from '@tabler/icons-react';
import { useLocation } from 'react-router';
import { IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useState } from 'react';
import UploadPPMP from '../dialogs/uploadPPMP/UploadPPMP';

interface HeaderProps {
  userFullName: string;
  userEmailAddress: string;
}

export default function Header({ userFullName, userEmailAddress }: HeaderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadPPMPDialogOpen, setIsUploadPPMPDialogOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    const sidebar = document.querySelector('.nav-container');
    const header = document.querySelector('.header-container');

    if (sidebar && header) {
      sidebar.classList.toggle('collapsed');
    }
  }

  const location = useLocation();
  
  let currentPageName: string = "";
  let currentPageDescription: string = "";

  switch (location.pathname) {
    case '/dashboard':
      currentPageName = "Dashboard";
      currentPageDescription = "Manage and track your Project Procurement Management Plan";
      break;
    case '/ppmp-master-list':
      currentPageName = "PPMP Master List";
      currentPageDescription = "Full procurement items list with quantity";
      break;
    case '/procurement-monitor':
      currentPageName = "Procurement Monitor";
      currentPageDescription = "Track every item from planning to fulfillment";
      break;
    case '/in-lieu-reallocation':
      currentPageName = "In Lieu Reallocation";
      currentPageDescription = "Reallocate funds and resources as needed";
      break;
    case '/in-lieu-approvals':
      currentPageName = "In Lieu Approvals";
      currentPageDescription = "Review and approve reallocation requests";
      break;
    case '/user-management':
      currentPageName = "User Management";
      currentPageDescription = "Create and manage staff accounts for the CICT-PPMP system";
      break;
    case '/settings':
      currentPageName = "Settings";
      currentPageDescription = "Manage your account and system preferences";
      break;
    }

  return (
    <header className="header-container">
      <div className="menu-toggle">
        {isSidebarCollapsed ? (
          <div className="icon royal-red">
            <IconLayoutSidebarLeftExpand size={30} onClick={toggleSidebar} />
          </div>
        ) : (
          <div className="icon royal-red">
            <IconLayoutSidebarLeftCollapse size={30} onClick={toggleSidebar} color="white" />
          </div>
        )}
      </div>
      <div className="title">
        <h1 className="header-title">{currentPageName}</h1>
        <p className="header-description">{currentPageDescription}</p>
      </div>
      {currentPageName === "Dashboard" && (
        <button className="upload-button" onClick={() => {setIsUploadPPMPDialogOpen(true)}}>
          <IconUpload size={24} />
          Upload PPMP
        </button>
      )}

      <UploadPPMP isOpen={isUploadPPMPDialogOpen} onClose={() => {setIsUploadPPMPDialogOpen(false)}} />
        
      {/*<button className="notification-button">
        <span className="notification-count">3</span>
        <IconBell size={24} />
      </button>*/}
      <div className="user-profile">
        <div className="user-icon">
          <p>{userFullName.charAt(0)}</p>
        </div>
        <div className="user-info">
          <span className="name">{userFullName}</span>
          <span className="email">{userEmailAddress}</span>
        </div>
      </div>
    </header>
  );
}