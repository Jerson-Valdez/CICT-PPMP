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
import { getAccessToken } from '../../../supadb';

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

interface aiFeaturesData {
    icon: JSX.Element;
    title: string;
    description: string;
    percentage?: number;
}

export default function Dashboard(){
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: string }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

    const [totalAnnualBudget, setTotalAnnualBudget] = useState(0);
    const [committedFunds, setCommittedFunds] = useState(0);
    const [availableLieuPoolFunds, setAvailableLieuPoolFunds] = useState(0);
    const [openFunds, setOpenFunds] = useState(0);
    const [requestedFunds, setRequestedFunds] = useState(0);
    const [arrivedFunds, setArrivedFunds] = useState(0);
    const [pendingInLieuCount, setPendingInLieuCount] = useState(0);
    const [committedFundsPercentage, setCommittedFundsPercentage] = useState(0);
    const [openFundsPercentage, setOpenFundsPercentage] = useState(0);
    const [logs, setLogs] = useState<Log[]>([]);
    const [aiNotUtilizedItemsPercentage, setAiNotUtilizedItemsPercentage] = useState(0);
    const [aiFrequentInLieuItemsPercentage, setAiFrequentInLieuItemsPercentage] = useState(0);
    const [aiNotUtilizedCurrentYearPercentage, setAiNotUtilizedCurrentYearPercentage] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            handleDashboardFiscalYearChange(selectedFiscalYear);
            try {
                const formData = new FormData();
                formData.append('year', String(selectedFiscalYear));

                const [dashboardCardsResponse, importancesResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/dashboard_cards/', {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
                    }),
                    fetch('https://test-ppmp.onrender.com/api/get_importances/?year=' + selectedFiscalYear, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
                    })
                ]);

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

                    setLogs((dashboardCardsResult.logs || []).slice().reverse());

                    setCommittedFundsPercentage((dashboardCardsResult.committedFunds / dashboardCardsResult.totalAnnualBudget) * 100);
                    setOpenFundsPercentage((dashboardCardsResult.openFunds / dashboardCardsResult.totalAnnualBudget) * 100);
                }

                if (!importancesResponse.ok) {
                    toast.error("Failed to fetch AI importances data. Please try again later.");
                }
                else {
                    const importancesResult = await importancesResponse.json();
                    const item1 = importancesResult.notUtilizedItems || 0;
                    const item2 = importancesResult.frequentInLieuItems || 0;
                    const item3 = importancesResult.notUtilizedCurrentYear || 0;

                    console.log("AI Importances Data:", importancesResult);

                    const grandTotal = item1 + item2 + item3;

                    if (grandTotal > 0) {
                        setAiNotUtilizedItemsPercentage(Number(((item1 / grandTotal) * 100).toFixed(2)));
                        setAiFrequentInLieuItemsPercentage(Number(((item2 / grandTotal) * 100).toFixed(2)));
                        setAiNotUtilizedCurrentYearPercentage(Number(((item3 / grandTotal) * 100).toFixed(2)));
                    } else {
                        setAiNotUtilizedItemsPercentage(0);
                        setAiFrequentInLieuItemsPercentage(0);
                        setAiNotUtilizedCurrentYearPercentage(0);
                    }
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
        {icon: <IconChecklist size={24} />, iconColor: "green", title: "Fulfilled Items", description: "Allocated funds of fulfilled items", value: arrivedFunds,  color: "green-yellow",},
    ];

    const aiFeaturesDataTraining: aiFeaturesData[] = [
        {icon: <IconChartBarOff size={18}/>, title: "Not Utilized Items", description: "Based on the historical low-utilization items", percentage: aiNotUtilizedItemsPercentage},
        {icon: <IconTransform size={18}/>, title: "Frequent In Lieu Items", description: "Based on the historical frequency of in-lieu items", percentage: aiFrequentInLieuItemsPercentage},
    ];

    const aiFeaturesDataCurrentYear: aiFeaturesData[] = [
        {icon: <IconChartBarOff size={18}/>, title: "Not Utilized in Current Year", description: "Based on Items not utilized for the current fiscal year", percentage: aiNotUtilizedCurrentYearPercentage},
    ];

    const knapsackFeaturesData: aiFeaturesData[] = [
        {icon: <IconClockDollar size={18}/>, title: "Lowest Price possible of Combined Items", description: "Algorithm to find the lowest price possible of combined items based on the available budget."},
    ];

    function handleDashboardFiscalYearChange(newFiscalYear: string) {
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
                            <div className="alert-card-content">
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
                                <h2>Bulk Budget Balancing (AI Decision Weights)</h2>
                                <p>Your AI-powered budget optimization tool</p>
                            </div>
                        </div>
                        <div className="content-container">
                            <Link to="/in-lieu-reallocation" className="btn-alab">
                                <img src={alab} alt="ALAB Icon" className="alab-link-icon" style={{ width: '20px', height: '20px' }}/>
                                <span>Optimize Your Budget with ALAB</span>
                            </Link>
                            <div className="title-content-container">
                                <h4>Training Data Importances</h4>
                                {aiFeaturesDataTraining.map((data, index) => (
                                    <div className="ai-features-content" key={index}>
                                        <div className="icon blue">{data.icon}</div>
                                        <div className="description">
                                            <h3>{data.title}</h3>
                                            <p>{data.description}</p>
                                        </div>
                                        <span>{data.percentage !== undefined ? data.percentage.toFixed(2) : 'N/A'}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="title-content-container">
                                <h4>Current Year Importances</h4>
                                {aiFeaturesDataCurrentYear.map((data, index) => (
                                    <div className="ai-features-content" key={index}>
                                        <div className="icon green">{data.icon}</div>
                                        <div className="description">
                                            <h3>{data.title}</h3>
                                            <p>{data.description}</p>
                                        </div>
                                        <span>{data.percentage !== undefined ? data.percentage.toFixed(2) : 'N/A'}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="title-content-container">
                                <h4>Knapsack Problem Features</h4>
                                {knapsackFeaturesData.map((data, index) => (
                                    <div className="ai-features-content" key={index}>
                                        <div className="icon purple">{data.icon}</div>
                                        <div className="description">
                                            <h3>{data.title}</h3>
                                            <p>{data.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingWrapper>
        </main>
    )
}