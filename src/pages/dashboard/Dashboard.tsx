import { type JSX } from 'react';
import DashboardCard from '../../components/cards/dashboard_card/DashboardCard';
import './dashboard.css';
import { IconWallet, IconFilter2Check, IconStatusChange, IconCurrencyDollarOff, IconGitPullRequestDraft, IconChecklist } from '@tabler/icons-react';

export default function Dashboard(){
    interface DashboardData {
        icon: JSX.Element;
        iconColor: string;
        title: string;
        description: string;
        value: number;
        color: string;
        additionalInfo?: string;
    }

    const dashboardData: DashboardData[] = [
        {
            icon: <IconWallet size={24} />,
            iconColor: "blue",
            title: "Total Annual Budget",
            description: "FY 2026 Allocation",
            value: 5000000,
            color: "blue-purple",
        },
        {
            icon: <IconFilter2Check size={24} />,
            iconColor: "green",
            title: "Committed Funds", 
            description: "Items in PR/Arrived",
            value: 1250000,
            color: "green-teal",
            additionalInfo: " 57.0% Utilized"
        },
        {
            icon: <IconStatusChange size={24} />,
            iconColor: "yellow",
            title: "Available Lieu Pool",
            description: "Planned but not requested",
            value: 3050000,
            color: "yellow-red",
        },
        {
            icon: <IconCurrencyDollarOff size={24} />,
            iconColor: "purple",
            title: "Open Funds",
            description: "Not planned funds",
            value: 700000,
            color: "purple-black",
        },
        {
            icon: <IconGitPullRequestDraft size={24} />,
            iconColor: "blue",
            title: "Purchase Request",
            description: "Funds currently in PR",
            value: 625000,
            color: "cyan-blue",
        },
        {
            icon: <IconChecklist size={24} />,
            iconColor: "green",
            title: "Arrived Items",
            description: "Allocated funds of arrived items",
            value: 625000,
            color: "green-yellow",
        },
    ];

    return (
        <main className="dashboard-page-container">
            <div className="dashboard-card-container">
                {dashboardData.map((data, index) => (
                    <DashboardCard
                        key={index}
                        icon={data.icon}
                        iconColor={data.iconColor}
                        title={data.title}
                        description={data.description}
                        value={data.value}
                        color={data.color}
                        additionalInfo={data.additionalInfo}
                    />
                ))}
            </div>
        </main>
    )
}