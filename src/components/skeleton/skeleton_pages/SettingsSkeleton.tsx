export default function SettingsSkeleton() {
    return (
        <div className="flex flex-col items-start justify-start w-full gap-2 animate-pulse">
            <div className="h-4 w-1/8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-11 w-full bg-gray-300 rounded animate-pulse"></div>

            <div className="h-4 w-1/8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-11 w-full bg-gray-300 rounded animate-pulse"></div>
        </div>
    );
}