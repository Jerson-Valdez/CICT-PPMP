import DashboardBottomSkeleton from "../DashboardBottomSkeleton";
import DashboardCardSkeleton from "../DashboardCardSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="flex flex-wrap w-full gap-4 justify-center">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
      <div className="flex flex-row items-center justify-center gap-3 w-full max-md:flex-col">
        <div className="bg-gray-100 flex-6 flex flex-col items-start justify-start p-5 rounded-xl shadow-2xl w-full gap-2 animate-pulse">
          <div className="h-3 bg-gray-300 w-1/4 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-300 w-1/3 rounded animate-pulse"></div>
          <div className="h-60 bg-gray-300 w-full rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-100 flex-2 flex flex-col items-start justify-start p-5 rounded-xl shadow-2xl w-full gap-2 animate-pulse">
          <div className="h-3 bg-gray-300 w-1/4 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-300 w-1/3 rounded animate-pulse"></div>
          <div className="h-60 bg-gray-300 w-full rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-wrap w-full gap-4 justify-center">
        <DashboardBottomSkeleton />
      </div>
    </div>
  );
}
