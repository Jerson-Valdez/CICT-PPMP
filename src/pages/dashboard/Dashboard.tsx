import { useState, useEffect, type JSX } from 'react'; // 1. Added useState and useEffect
import DashboardCard from '../../components/cards/dashboard_card/DashboardCard';
import './dashboard.css';
import { IconWallet, IconFilter2Check, IconStatusChange, IconCurrencyDollarOff, IconGitPullRequestDraft, IconChecklist, IconChartBarOff, IconTransform, IconClockDollar, IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import DashboardProcurementCard from '../../components/cards/dashboard_procurement_card/DashboardProcurementCard';
import alab from '../../assets/icons/alab.svg';
import { Link } from 'react-router';
import LoadingWrapper from '../../components/wrappers/loading wrapper/LoadingWrapper';
import DashboardSkeleton from '../../components/skeleton/skeleton_pages/DashboardSkeleton';
import { toast } from '../../components/toast/ToastService';
import { useOutletContext } from 'react-router';

interface DashboardData {
    icon: JSX.Element;
    iconColor: string;
    title: string;
    description: string;
    value: number;
    color: string;
    additionalInfo?: string;
}

interface Log {
    actionType: string;
    description: string;
    date: string;
    value?: number;
    userFullName: string;
    fiscalYear: number;
}

export default function Dashboard(){
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: number }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<number | null>(null);

    const [totalAnnualBudget, setTotalAnnualBudget] = useState(5000000);
    const [committedFunds, setCommittedFunds] = useState(1250000);
    const [availableLieuPoolFunds, setAvailableLieuPoolFunds] = useState(3050000);
    const [openFunds, setOpenFunds] = useState(700000);
    const [requestedFunds, setRequestedFunds] = useState(625000);
    const [arrivedFunds, setArrivedFunds] = useState(625000);
    const [pendingInLieuCount, setPendingInLieuCount] = useState(5);
    const [committedFundsPercentage, setCommittedFundsPercentage] = useState(0);
    const [openFundsPercentage, setOpenFundsPercentage] = useState(0);
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            handleDashboardFiscalYearChange(selectedFiscalYear);
            try {
                const formData = new FormData();
                formData.append('year', String(selectedFiscalYear));

                const [dashboardCardsResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/dashboard_cards/', {
                        method: "POST",
                        body: formData
                    })
                ]);

                setLogs([
                    {actionType: "rejected", description: "Purchase requests that have been rejected", date: "2023-10-15", value: 20000, userFullName: "John Doe", fiscalYear: 2024},
                    {actionType: "upload", description: "Purchase requests that have been uploaded", date: "2023-10-15", userFullName: "John Doe", fiscalYear: 2024},
                    {actionType: "approved", description: "Purchase requests that have been approved", date: "2023-10-15", value: 50000, userFullName: "John Doe", fiscalYear: 2024},
                ])

                if (!dashboardCardsResponse.ok) {
                    toast.error("Failed to fetch dashboard cards data. Please try again later.");
                } else {
                    const dashboardCardsResult = await dashboardCardsResponse.json();
                    setTotalAnnualBudget(dashboardCardsResult.totalAnnualBudget);
                    setCommittedFunds(dashboardCardsResult.committedFunds);
                    setAvailableLieuPoolFunds(dashboardCardsResult.availableLieuPoolFunds);
                    setOpenFunds(dashboardCardsResult.openFunds);
                    setRequestedFunds(dashboardCardsResult.requestedFunds);
                    setArrivedFunds(dashboardCardsResult.arrivedFunds);
                    setPendingInLieuCount(dashboardCardsResult.pendingInLieuCount);

                    console.log("Pending In Lieu Count: ", dashboardCardsResult.pendingInLieuCount);

                    setCommittedFundsPercentage((dashboardCardsResult.committedFunds / dashboardCardsResult.totalAnnualBudget) * 100);
                    setOpenFundsPercentage((dashboardCardsResult.openFunds / dashboardCardsResult.totalAnnualBudget) * 100);
                }

            } catch (error) {
                console.error("Error fetching dashboard cards data:", error);
                toast.error("Network error. Please try again later.");
            }
            finally {
                setIsInitialLoading(false);
            }
        };
        loadDashboardData();
                
    }, [selectedFiscalYear]);

    const dashboardData: DashboardData[] = [
        {icon: <IconWallet size={24} />, iconColor: "blue", title: "Total Annual Budget", description: "FY 2026 Allocation", value: totalAnnualBudget, color: "blue-purple",},
        {icon: <IconFilter2Check size={24} />, iconColor: "green", title: "Committed Funds", description: "Items in PR/Arrived", value: committedFunds,color: "green-teal",additionalInfo: `${committedFundsPercentage?.toFixed(1)}% Utilized`},
        {icon: <IconStatusChange size={24} />, iconColor: "yellow", title: "Available Lieu Pool", description: "Planned but not requested", value: availableLieuPoolFunds, color: "yellow-red",},
        {icon: <IconCurrencyDollarOff size={24} />, iconColor: "purple", title: "Open Funds", description: "Not planned funds", value: openFunds, color: "purple-black", additionalInfo: `${openFundsPercentage?.toFixed(1)}% Unutilized`},
        {icon: <IconGitPullRequestDraft size={24} />, iconColor: "blue", title: "Purchase Request", description: "Funds currently in PR", value: requestedFunds, color: "cyan-blue",},
        {icon: <IconChecklist size={24} />, iconColor: "green", title: "Arrived Items", description: "Allocated funds of arrived items", value: arrivedFunds,  color: "green-yellow",},
    ];

    function handleDashboardFiscalYearChange(newFiscalYear: number) {
        if (newFiscalYear !== fiscalYearHolder) {
            setIsInitialLoading(true);
            setFiscalYearHolder(newFiscalYear);
        }
    }

    return (
        <main className="page-container dashboard">
            <LoadingWrapper isLoading={isInitialLoading} skeleton={<DashboardSkeleton />}>
                
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
                    {pendingInLieuCount > 0 && (
                        <div className="alert-card">
                            <div className="icon yellow">
                                <IconAlertCircle size={24} />
                            </div>
                            <div className="content">
                                <h3>In Lieu Approval</h3>
                                <span>{pendingInLieuCount}</span>
                                <p>In-Lieu requests that require approval.</p>
                            </div>
                            <Link to="/in-lieu-approvals" className="view-details">
                                View Details <IconArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="lower-dashboard-container">
                    <div className="procurement-timeline-container">
                        <div className="procurement-timeline-header">
                            <div className="title-container">
                                <h2>Procurement Timeline</h2>
                                <p>Track the progress of your procurement activities</p>
                            </div>
                        </div>
                        <div className="content-container">
                            {logs.map((log, index) => (
                                <DashboardProcurementCard
                                    key={index}
                                    actionType={log.actionType}
                                    description={log.description}
                                    date={log.date}
                                    value={log.value}
                                    userFullName={log.userFullName}
                                    fiscalYear={log.fiscalYear}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="ai-features-container">
                        <div className="ai-features-header">
                            <div className="title-container">
                                <h2>Bulk Balancing Optimization</h2>
                                <p>In Lieu Assistant</p>
                            </div>
                        </div>
                        <div className="content-container">
                            <Link to="/in-lieu-reallocation" className="btn-alab">
                                <img src={alab} alt="ALAB Icon" className="alab-link-icon" style={{ width: '25px', height: '25px' }}/>
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
            </LoadingWrapper>
        </main>
    )
}