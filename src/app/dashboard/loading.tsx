
export default function DashboardLoading() {
    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8 space-y-10 animate-pulse">
            <div className="text-center lg:text-left">
                <div className="h-10 bg-muted rounded-lg w-1/2 mb-2 mx-auto lg:mx-0"></div>
                <div className="h-5 bg-muted rounded-lg w-3/4 mx-auto lg:mx-0"></div>
            </div>

            <div className="p-0 md:p-6 md:bg-white/70 md:dark:bg-gray-900/50 md:backdrop-blur-md md:rounded-2xl md:border md:border-gray-200 md:dark:border-gray-800 space-y-8">
                <div className="space-y-6">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                </div>
                 <div className="space-y-6">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-24 bg-muted rounded w-full"></div>
                </div>
                <div className="flex justify-between items-center pt-4">
                    <div className="h-10 bg-muted rounded w-36"></div>
                    <div className="h-10 bg-muted rounded w-28"></div>
                </div>
            </div>
        </div>
    );
}
