interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
}

export default function StatsCard({
    title,
    value,
    description,
}: StatsCardProps) {
    return (
        <div className="group bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900">

            <p className="text-sm text-zinc-400">
                {title}
            </p>

            <p className="text-3xl font-bold mt-3 tracking-tight">
                {value}
            </p>

            {description && (
                <p className="text-xs text-zinc-500 mt-2">
                    {description}
                </p>
            )}

        </div>
    );
}