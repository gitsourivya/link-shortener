interface Click {
    id: number;
    timestamp: string;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
}

interface ClickTableProps {
    clicks: Click[];
}

export default function ClickTable({
    clicks,
}: ClickTableProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
                Click History
            </h3>

            {clicks.length === 0 ? (
                <p className="text-gray-400">
                    No clicks yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {clicks.map((click) => (
                        <div
                            key={click.id}
                            className="border border-zinc-800 rounded-lg p-4"
                        >
                            <p className="text-sm">
                                <span className="text-gray-400">
                                    Time:
                                </span>{" "}
                                {new Date(
                                    click.timestamp
                                ).toLocaleString()}
                            </p>

                            <p className="text-sm mt-1">
                                <span className="text-gray-400">
                                    IP:
                                </span>{" "}
                                {click.ipAddress || "Unknown"}
                            </p>

                            <p className="text-sm mt-1 break-all">
                                <span className="text-gray-400">
                                    Browser:
                                </span>{" "}
                                {click.userAgent || "Unknown"}
                            </p>

                            <p className="text-sm mt-1">
                                <span className="text-gray-400">
                                    Referrer:
                                </span>{" "}
                                {click.referrer || "Direct"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}