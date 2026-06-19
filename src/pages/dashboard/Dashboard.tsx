import { type JSX } from 'react';
import DashboardCard from '../../components/cards/dashboard_card/DashboardCard';
import './dashboard.css';
import { IconWallet, IconFilter2Check, IconStatusChange, IconCurrencyDollarOff, IconGitPullRequestDraft, IconChecklist, IconTimelineEventText, IconScale, IconChartBarOff, IconTransform, IconClockDollar, IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import DashboardProcurementCard from '../../components/cards/dashboard_procurement_card/DashboardProcurementCard';
import alab from '../../assets/icons/alab.svg';
import { Link } from 'react-router';

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

    const inLieuAlert:number = 1; // Example ng kung ilan ang pending in-lieu requests

    return (
        <main className="page-container dashboard">
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
                <div className="alert-card">
                    <div className="icon yellow">
                        <IconAlertCircle size={24} />
                    </div>
                    <div className="content">
                        <h3>In Lieu Approval</h3>
                        <span>{inLieuAlert}</span>
                        <p>In-Lieu requests that require approval.</p>
                    </div>
                    <Link to="/in-lieu-approvals" className="view-details">
                        View Details <IconArrowRight size={16} />
                    </Link>
                </div>
            </div>
            <div className="lower-dashboard-container">
                <div className="procurement-timeline-container">
                    <div className="procurement-timeline-header">
                        <div className="icon royal-red">
                            <IconTimelineEventText size={40}/>
                        </div>
                        <div className="title-container">
                            <h2>Procurement Timeline</h2>
                            <p>Track the progress of your procurement activities</p>
                        </div>
                    </div>
                    <div className="content-container">
                        <DashboardProcurementCard 
                            icon="rejected"
                            title="Rejected PR" 
                            description="Purchase requests that have been rejected" 
                            date="2023-10-15" 
                            value={20000}/>
                        <DashboardProcurementCard 
                            icon="upload"
                            title="Uploaded PR" 
                            description="Purchase requests that have been uploaded" 
                            date="2023-10-15" />
                        <DashboardProcurementCard 
                            icon="approved"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="reallocate"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="upload"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="pr"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="arrived"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="rejected"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard 
                            icon="cancel"
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15" 
                            value={50000}/>
                            <DashboardProcurementCard
                            title="Purchase Request" 
                            description="Purchase request  of 10 SSD is requested" 
                            date="2023-10-15"/>
                    </div>
                </div>

                <div className="ai-features-container">
                    <div className="ai-features-header">
                        <div className="icon alab">
                            <img src={alab} alt="ALAB Icon" className="alab-icon" style={{ width: '25px', height: '35px' }}/>
                        </div>
                        <div className="title-container">
                            <h2>Bulk Balancing Optimization</h2>
                            <p>In Lieu Assistant</p>
                        </div>
                    </div>
                    <div className="content-container">
                        <Link to="/in-lieu-reallocation" className="btn-alab">
                            <IconScale size={24} className="alab-link-icon"/>
                            <span>Optimize Your Budget with ALAB</span>
                        </Link>

                        <div className="ai-features-content">
                            <div className="icon red"><IconChartBarOff size={18}/></div>
                            <div className="description">
                                <h3>Not Utilized Items</h3>
                                <p>Based on the historical low-utilization items</p>
                            </div>
                            <span>35%</span>
                        </div>
                        <div className="ai-features-content">
                            <div className="icon red"><IconTransform size={18}/></div>
                            <div className="description">
                                <h3>Frequent In Lieu Items</h3>
                                <p>Based on the historical frequency of in-lieu items</p>
                            </div>
                            <span>35%</span>
                        </div>
                        <div className="ai-features-content">
                            <div className="icon red"><IconChartBarOff size={18}/></div>
                            <div className="description">
                                <h3>Not Utilized in Current Year</h3>
                                <p>Based on Items not utilized for the current fiscal year</p>
                            </div>
                            <span>20%</span>
                        </div>
                        <div className="ai-features-content">
                            <div className="icon red"><IconClockDollar size={18}/></div>
                            <div className="description">
                                <h3>Lowest Price</h3>
                                <p>Based on the items price to fit the budget</p>
                            </div>
                            <span>10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}