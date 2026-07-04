import type { ReactNode } from "react";

interface LoadingWrapperProps {
    isLoading: boolean;
    skeleton?: ReactNode; 
    children: ReactNode;
}

const GenericSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse p-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-32 w-full bg-gray-100 rounded-lg"></div>
        <div className="h-32 w-full bg-gray-100 rounded-lg"></div>
    </div>
);

export default function LoadingWrapper({ 
    isLoading, 
    skeleton = <GenericSkeleton />, 
    children 
}: LoadingWrapperProps) {
    
    if (isLoading) {
        return <>{skeleton}</>;
    }
    
    return <>{children}</>;
}