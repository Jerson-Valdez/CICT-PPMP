import CountCardSkeleton from "../CountCardSkeleton";

export default function MonitoringSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full animate-pulse">
                <CountCardSkeleton />
                <CountCardSkeleton />
                <CountCardSkeleton />
                <CountCardSkeleton />
            </div>
            <div className="flex flex-row bg-gray-100 shadow-2xl items-center justify-between w-full gap-4 p-5 animate-pulse">
                <div className="h-5 flex-1 bg-gray-300 rounded mr-50 animate-pulse"></div>
                <div className="h-10 flex-1 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 flex-1 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col bg-gray-100 shadow-2xl items-start justify-between w-full gap-4 p-5 animate-pulse">
                <div className="h-3 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex flex-row justify-between w-full gap-4">
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
                <div className="flex flex-row justify-start w-full gap-4">
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="flex flex-col bg-gray-100 shadow-2xl items-start justify-between w-full gap-4 p-5 animate-pulse">
                <div className="h-3 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex flex-row justify-between w-full gap-4">
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-15 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
                <div className="flex flex-row justify-start w-full gap-4">
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}