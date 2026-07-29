import InLieuReallocationCardSkeleton from "../InLieuReallocationCardSkeleton";

export default function InLieuReallocationSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start w-full gap-4 h-90 animate-pulse overflow-hidden">
            <InLieuReallocationCardSkeleton />
            <InLieuReallocationCardSkeleton />
            <InLieuReallocationCardSkeleton />
            <InLieuReallocationCardSkeleton />
            <InLieuReallocationCardSkeleton />
        </div>
    );
}