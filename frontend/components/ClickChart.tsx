"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


interface Click {

    id: number;

    timestamp: string;

    ipAddress: string | null;

    userAgent: string | null;

    referrer: string | null;
}


interface ClickChartProps {

    clicks: Click[];
}


export default function ClickChart({
    clicks,
}: ClickChartProps) {


    // Group clicks by date

    const groupedClicks: Record<
        string,
        number
    > = {};


    clicks.forEach((click) => {

        const date =
            new Date(
                click.timestamp
            ).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                }
            );


        if (!groupedClicks[date]) {

            groupedClicks[date] = 0;

        }


        groupedClicks[date]++;

    });


    // Convert grouped data to chart format

    const chartData =
        Object.entries(
            groupedClicks
        ).map(
            ([date, count]) => ({
                date,
                clicks: count,
            })
        );


    // No clicks

    if (chartData.length === 0) {

        return (

            <div className="h-80 flex items-center justify-center">

                <p className="text-zinc-500">
                    No clicks recorded yet.
                </p>

            </div>

        );

    }


    return (

        <div className="w-full h-80">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <LineChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#27272a"
                    />


                    <XAxis
                        dataKey="date"
                        stroke="#71717a"
                    />


                    <YAxis
                        allowDecimals={false}
                        stroke="#71717a"
                    />


                    <Tooltip
                        contentStyle={{
                            backgroundColor:
                                "#18181b",
                            border:
                                "1px solid #27272a",
                            borderRadius:
                                "8px",
                            color:
                                "#ffffff",
                        }}
                    />


                    <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={{
                            r: 4,
                        }}
                        activeDot={{
                            r: 6,
                        }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );
}