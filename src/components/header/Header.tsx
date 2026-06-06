import './header.css';
import { IconUpload, IconBell, IconUser } from '@tabler/icons-react';

export default function Header({ currentPageName, currentPageDescription }: { currentPageName: string, currentPageDescription: string }) {
  return (
    <header className="header-container">
      <div className="title">
        <h1 className="header-title">{currentPageName}</h1>
        <p className="header-description">{currentPageDescription}</p>
      </div>
      {currentPageName === "Dashboard" && (
        <button className="upload-button">
          <IconUpload size={24} />
          Upload PPMP
        </button>
      )}
      <button className="notification-button">
        <span className="notification-count">3</span>
        <IconBell size={24} />
      </button>
      <div className="user-profile">
        <div className="user-icon">
          <IconUser size={24} />
        </div>
        <div className="user-info">
          <span className="name">Jerson Patrick Valdez</span>
          <span className="email">jerson.valdez@example.com</span>
        </div>
      </div>
    </header>
  );
}