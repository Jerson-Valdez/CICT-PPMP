import OverviewCard from '../../components/cards/overview_card/OverviewCard';
import './overview-section.css';
import { IconUsers } from '@tabler/icons-react';
import { IconShield } from '@tabler/icons-react';

export default function OverviewSection(){

    const overviews = [
        {
            icon: <IconUsers />,
            title: "Department Staff Portal",
            description: "For the staff who is accountable for procurement management of the CICT department in BSU",
            doItems: ["Dashboard", "PPMP Master List", "Procurement Monitoring", "In-Lieu Reallocation", "Purchase Request Generation", "Upload PPMP Spreadsheet", "Supplemental PPMP"],
            color: "yellowred"
        },
        {
            icon: <IconShield />,
            title: "Department Dean Portal",
            description: "For the Dean of the Department of the CICT in Bulacan State University",
            doItems: ["Dashboard", "PPMP Master List", "Procurement Monitoring", "In-Lieu Reallocation", "In-Lieu Approval", "Purchase Request Generation", "Upload PPMP Spreadsheet", "Supplemental PPMP", "User Management"],
            color: "redgray"
        }
    ];

    return (
        <section className="overview-section">
            <h2>Dashboard Overviews</h2>
            <p>What are the things you can do in portal</p>
            <div className="overview-container">
                {overviews.map((overview, index) => (
                    <OverviewCard
                        key={index}
                        icon={overview.icon}
                        title={overview.title}
                        description={overview.description}
                        doItems={overview.doItems}
                        color={overview.color}
                    />
                ))}
            </div>
        </section>
    );
}