import { type JSX } from 'react';
import './dashboard-card.css';

export default function DashboardCard({ icon, iconColor, title, description, value, color, additionalInfo }: { icon: JSX.Element; iconColor: string; title: string; description: string; value: number; color: string; additionalInfo?: string }) {
    return (
        <div className="dashboard-card">
            <div className={`icon ${iconColor}`}>
                {icon}
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <h2>PHP {value.toLocaleString()}</h2>
                <p>{description}{additionalInfo && <span className="additional-info">{additionalInfo}</span>}</p>
            </div>
            <div className={`card-line ${color}`} />
        </div>
    )
}