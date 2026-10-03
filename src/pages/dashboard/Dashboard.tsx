import { useState, useEffect, type JSX } from "react";
import DashboardCard from "../../components/cards/dashboard_card/DashboardCard";
import "./dashboard.css";
import {
  IconWallet,
  IconFilter2Check,
  IconStatusChange,
  IconCurrencyDollarOff,
  IconGitPullRequestDraft,
  IconChecklist,
  IconAlertCircle,
  IconArrowRight,
} from "@tabler/icons-react";
import DashboardProcurementCard from "../../components/cards/dashboard_procurement_card/DashboardProcurementCard";
import { Link } from "react-router";
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import DashboardSkeleton from "../../components/skeleton/skeleton_pages/DashboardSkeleton";
import { toast } from "../../components/toast/ToastService";
import { useOutletContext } from "react-router";
import { getAccessToken } from "../../../supadb";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

export default function Dashboard() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { selectedFiscalYear } = useOutletContext<{
    selectedFiscalYear: string;
  }>();
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
  const [prTrendData, setPrTrendData] = useState<any[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      handleDashboardFiscalYearChange(selectedFiscalYear);
      try {
        const formData = new FormData();
        formData.append("year", String(selectedFiscalYear));

        const [dashboardCardsResponse] = await Promise.all([
          fetch("https://test-ppmp.onrender.com/api/dashboard_cards/", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${(await getAccessToken()) || ""}`,
            },
          }),
        ]);

        if (!dashboardCardsResponse.ok) {
          toast.error(
            "Failed to fetch dashboard cards data. Please try again later.",
          );
        } else {
          const dashboardCardsResult = await dashboardCardsResponse.json();
          setTotalAnnualBudget(dashboardCardsResult.totalAnnualBudget);
          setCommittedFunds(dashboardCardsResult.committedFunds);
          setAvailableLieuPoolFunds(
            dashboardCardsResult.availableLieuPoolFunds,
          );
          setOpenFunds(dashboardCardsResult.openFunds);
          setRequestedFunds(dashboardCardsResult.requestedFunds);
          setArrivedFunds(dashboardCardsResult.arrivedFunds);
          setPendingInLieuCount(dashboardCardsResult.pendingInLieuCount);

          setLogs((dashboardCardsResult.logs || []).slice().reverse());

          setCommittedFundsPercentage(
            (dashboardCardsResult.committedFunds /
              dashboardCardsResult.totalAnnualBudget) *
              100,
          );
          setOpenFundsPercentage(
            (dashboardCardsResult.openFunds /
              dashboardCardsResult.totalAnnualBudget) *
              100,
          );
          setPrTrendData(dashboardCardsResult.prTrend);
        }
      } catch (error) {
        console.error("Error fetching dashboard cards data:", error);
        toast.error("Network error. Please try again later.");
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadDashboardData();
  }, [selectedFiscalYear]);

  const dashboardData: DashboardData[] = [
    {
      icon: <IconWallet size={20} />,
      iconColor: "blue",
      title: "Total Annual Budget",
      description: "FY 2026 Allocation",
      value: totalAnnualBudget,
      color: "blue-purple",
    },
    {
      icon: <IconFilter2Check size={20} />,
      iconColor: "green",
      title: "Committed Funds",
      description: "Items in PR/Arrived",
      value: committedFunds,
      color: "green-teal",
      additionalInfo: `${committedFundsPercentage?.toFixed(1)}% Utilized`,
    },
    {
      icon: <IconStatusChange size={20} />,
      iconColor: "yellow",
      title: "Available Lieu Pool",
      description: "Planned but not requested",
      value: availableLieuPoolFunds,
      color: "yellow-red",
    },
    {
      icon: <IconCurrencyDollarOff size={20} />,
      iconColor: "purple",
      title: "Open Funds",
      description: "Not planned funds",
      value: openFunds,
      color: "purple-black",
      additionalInfo: `${openFundsPercentage?.toFixed(1)}% Unutilized`,
    },
    {
      icon: <IconGitPullRequestDraft size={20} />,
      iconColor: "blue",
      title: "Purchase Request",
      description: "Funds currently in PR",
      value: requestedFunds,
      color: "cyan-blue",
    },
    {
      icon: <IconChecklist size={20} />,
      iconColor: "green",
      title: "Fulfilled Items",
      description: "Allocated funds of fulfilled items",
      value: arrivedFunds,
      color: "green-yellow",
    },
  ];

  const budgetData = [
    { name: "Pending Purchase Requests", value: requestedFunds },
    { name: "Fulfilled Purchase Requests", value: arrivedFunds },
    { name: "Available Lieu Pool", value: availableLieuPoolFunds },
    { name: "Open Funds", value: openFunds },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ad46ff"];

  function handleDashboardFiscalYearChange(newFiscalYear: string) {
    if (newFiscalYear !== fiscalYearHolder) {
      setIsInitialLoading(true);
      setFiscalYearHolder(newFiscalYear);
    }
  }

  return (
    <main className="page-container dashboard">
      <LoadingWrapper
        isLoading={isInitialLoading}
        skeleton={<DashboardSkeleton />}
      >
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
                <IconAlertCircle size={20} />
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

        <div className="analytics-container">
          <div className="analytics-area-graph-container">
            <div className="analytics-header">
              <div className="title-container">
                <h2>3-Year PR Volume Trend</h2>
                <p>Insights and analytics of latest 3 years purchase requests history</p>
              </div>
            </div>
            <div className="content-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={prTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Light Blue (Subtle background) */}
                    <linearGradient id="color2024" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0} />
                    </linearGradient>

                    {/* Medium Blue */}
                    <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>

                    {/* Dark/Bold Blue (Strong focus for current year) */}
                    <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      opacity: 0.9,
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={24}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", color: "#4b5563" }}
                  />
                  <Area
                    type="bump"
                    dataKey="2024"
                    stroke="#bfdbfe"
                    strokeWidth={1}
                    fillOpacity={1}
                    fill="url(#color2024)"
                  />
                  <Area
                    type="bump"
                    dataKey="2025"
                    stroke="#60a5fa"
                    strokeWidth={1}
                    fillOpacity={1}
                    fill="url(#color2025)"
                  />
                  <Area
                    type="bump"
                    dataKey="2026"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#color2026)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-donut-graph-container">
            <div className="analytics-header">
              <div className="title-container">
                <h2>Funds Distribution for the Year {selectedFiscalYear}</h2>
                <p>Visualization of the distribution of funds</p>
              </div>
            </div>
            <div className="content-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pieColor0" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS[0]} />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <linearGradient id="pieColor1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS[1]} />
                      <stop offset="100%" stopColor="#016630" />
                    </linearGradient>
                    <linearGradient id="pieColor2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS[2]} />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <linearGradient id="pieColor3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS[3]} />
                      <stop offset="100%" stopColor="#6b21a8" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={budgetData}
                    innerRadius={30}
                    outerRadius={80}
                    paddingAngle={1}
                    cornerRadius={8}
                    dataKey="value"
                    stroke="none"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }: any) => {
                      if (!percent || percent < 0.05) return null;

                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;

                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          fontSize={12}
                          fontWeight={"bold"}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#pieColor${index % 4})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `PHP ${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      opacity: 0.9,
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="left"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#4b5563",
                      paddingBottom: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
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
        </div>
      </LoadingWrapper>
    </main>
  );
}
