"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../../lib/api";
import ClickChart from "../../components/ClickChart";

interface Click {
    id: number;
    timestamp: string;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
}

interface Analytics {
    shortCode: string;
    originalUrl: string;
    createdAt: string;

    totalClicks: number;
    uniqueVisitors: number;

    firstClick: string | null;
    lastClick: string | null;

    averageClicksPerDay: number;

    browserStats?: {
        [browser: string]: number;
    } | null;

    referrerStats?: {
        [source: string]: number;
    } | null;

    deviceStats?: {
        [device: string]: number;
    } | null;

    osStats?: {
        [os: string]: number;
    } | null;

    clicks: Click[];
}

export default function Dashboard() {

    const [analytics, setAnalytics] =
        useState<Analytics | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [shortCode, setShortCode] =
        useState("");


    useEffect(() => {

        // Check authentication

        const token =
            localStorage.getItem("token");

        if (!token) {

            window.location.href =
                "/login";

            return;
        }


        // Get short code from URL

        const params =
            new URLSearchParams(
                window.location.search
            );

        const code =
            params.get("code");

        if (!code) {

            setError(
                "No short code provided."
            );

            setLoading(false);

            return;
        }

        setShortCode(code);

        loadAnalytics(code);

    }, []);


    async function loadAnalytics(
        code: string
    ) {

        try {

            setLoading(true);

            setError("");

            const data =
                await getAnalytics(code);

            setAnalytics(data);

        } catch (error) {

            console.error(
                "Failed to load analytics:",
                error
            );

            if (
                error instanceof Error
            ) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Failed to load analytics."
                );
            }

        } finally {

            setLoading(false);
        }
    }


    function formatDate(
        date: string | null
    ) {

        if (!date) {

            return "No data";
        }

        return new Date(
            date
        ).toLocaleString();
    }


    if (loading) {

        return (

            <main className="min-h-screen bg-black text-white flex items-center justify-center">

                <div className="text-zinc-400">
                    Loading analytics...
                </div>

            </main>
        );
    }


    if (error) {

        return (

            <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">

                    <h1 className="text-xl font-semibold mb-3">
                        Analytics Error
                    </h1>

                    <p className="text-red-400 text-sm">
                        {error}
                    </p>

                </div>

            </main>
        );
    }


    if (!analytics) {

        return (

            <main className="min-h-screen bg-black text-white flex items-center justify-center">

                <p className="text-zinc-400">
                    No analytics data available.
                </p>

            </main>
        );
    }


    const browserStats =
        analytics.browserStats || {};

    const referrerStats =
        analytics.referrerStats || {};

    const deviceStats =
        analytics.deviceStats || {};

    const osStats =
        analytics.osStats || {};

    const clicks =
        analytics.clicks || [];


    return (

        <main className="min-h-screen bg-black text-white px-6 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Header */}

                <div className="mb-10">

                    <p className="text-sm text-zinc-500 mb-2">
                        ANALYTICS FOR
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <h1 className="text-3xl font-bold">
                                /{analytics.shortCode}
                            </h1>

                            <p className="text-zinc-500 mt-2 break-all">
                                {analytics.originalUrl}
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                loadAnalytics(
                                    shortCode
                                )
                            }
                            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
                        >
                            Refresh Analytics
                        </button>

                    </div>

                </div>


                {/* Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

                        <p className="text-sm text-zinc-500">
                            Total Clicks
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {analytics.totalClicks}
                        </p>

                        <p className="text-xs text-zinc-600 mt-2">
                            Total visits to this link
                        </p>

                    </div>


                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

                        <p className="text-sm text-zinc-500">
                            Unique Visitors
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {analytics.uniqueVisitors}
                        </p>

                        <p className="text-xs text-zinc-600 mt-2">
                            Based on unique IP addresses
                        </p>

                    </div>


                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

                        <p className="text-sm text-zinc-500">
                            Average / Day
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {analytics.averageClicksPerDay.toFixed(
                                2
                            )}
                        </p>

                        <p className="text-xs text-zinc-600 mt-2">
                            Average clicks per day
                        </p>

                    </div>


                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

                        <p className="text-sm text-zinc-500">
                            Short Code
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {analytics.shortCode}
                        </p>

                        <p className="text-xs text-zinc-600 mt-2">
                            Your unique link identifier
                        </p>

                    </div>

                </div>


                {/* Link Details */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-6">
                        Link Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-sm text-zinc-500">
                                Original URL
                            </p>

                            <p className="text-sm text-zinc-300 mt-2 break-all">
                                {analytics.originalUrl}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-zinc-500">
                                Short Code
                            </p>

                            <p className="text-sm text-zinc-300 mt-2">
                                {analytics.shortCode}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-zinc-500">
                                Created
                            </p>

                            <p className="text-sm text-zinc-300 mt-2">
                                {formatDate(
                                    analytics.createdAt
                                )}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-zinc-500">
                                First Click
                            </p>

                            <p className="text-sm text-zinc-300 mt-2">
                                {formatDate(
                                    analytics.firstClick
                                )}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-zinc-500">
                                Last Click
                            </p>

                            <p className="text-sm text-zinc-300 mt-2">
                                {formatDate(
                                    analytics.lastClick
                                )}
                            </p>

                        </div>

                    </div>

                </div>


                {/* Click Chart */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold">
                            Click Activity
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            Clicks grouped by date
                        </p>

                    </div>

                    <ClickChart
                        clicks={clicks}
                    />

                </div>


                {/* Browser + Referrer Analytics */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Browser Analytics */}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-semibold">
                            Browser Analytics
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1 mb-6">
                            Browsers used by visitors
                        </p>


                        {Object.keys(
                            browserStats
                        ).length === 0 ? (

                            <p className="text-zinc-500 text-sm">
                                No browser data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {Object.entries(
                                    browserStats
                                ).map(
                                    ([browser, count]) => (

                                        <div
                                            key={browser}
                                            className="flex items-center justify-between"
                                        >

                                            <span className="text-zinc-300">
                                                {browser}
                                            </span>

                                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                                                {count}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Referrer Analytics */}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-semibold">
                            Referrer Analytics
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1 mb-6">
                            Where your visitors came from
                        </p>


                        {Object.keys(
                            referrerStats
                        ).length === 0 ? (

                            <p className="text-zinc-500 text-sm">
                                No referrer data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {Object.entries(
                                    referrerStats
                                ).map(
                                    ([source, count]) => (

                                        <div
                                            key={source}
                                            className="flex items-center justify-between"
                                        >

                                            <span className="text-zinc-300">
                                                {source}
                                            </span>

                                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                                                {count}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* Device + OS Analytics */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Device Analytics */}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-semibold">
                            Device Analytics
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1 mb-6">
                            Devices used by visitors
                        </p>


                        {Object.keys(
                            deviceStats
                        ).length === 0 ? (

                            <p className="text-zinc-500 text-sm">
                                No device data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {Object.entries(
                                    deviceStats
                                ).map(
                                    ([device, count]) => (

                                        <div
                                            key={device}
                                            className="flex items-center justify-between"
                                        >

                                            <span className="text-zinc-300">
                                                {device}
                                            </span>

                                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                                                {count}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Operating System Analytics */}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-semibold">
                            Operating System
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1 mb-6">
                            Operating systems used by visitors
                        </p>


                        {Object.keys(
                            osStats
                        ).length === 0 ? (

                            <p className="text-zinc-500 text-sm">
                                No operating system data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {Object.entries(
                                    osStats
                                ).map(
                                    ([os, count]) => (

                                        <div
                                            key={os}
                                            className="flex items-center justify-between"
                                        >

                                            <span className="text-zinc-300">
                                                {os}
                                            </span>

                                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                                                {count}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* Click History */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold">
                            Click History
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            Individual visits to your shortened link
                        </p>

                    </div>


                    {clicks.length === 0 ? (

                        <div className="py-10 text-center">

                            <p className="text-zinc-500">
                                No clicks recorded yet.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="border-b border-zinc-800 text-left">

                                        <th className="py-3 pr-4 text-zinc-500 font-medium">
                                            Time
                                        </th>

                                        <th className="py-3 pr-4 text-zinc-500 font-medium">
                                            IP Address
                                        </th>

                                        <th className="py-3 pr-4 text-zinc-500 font-medium">
                                            Browser
                                        </th>

                                        <th className="py-3 text-zinc-500 font-medium">
                                            Referrer
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {clicks.map(
                                        (click) => (

                                            <tr
                                                key={
                                                    click.id
                                                }
                                                className="border-b border-zinc-800/50"
                                            >

                                                <td className="py-4 pr-4 text-zinc-300 whitespace-nowrap">
                                                    {formatDate(
                                                        click.timestamp
                                                    )}
                                                </td>

                                                <td className="py-4 pr-4 text-zinc-400">
                                                    {click.ipAddress ||
                                                        "Unknown"}
                                                </td>

                                                <td className="py-4 pr-4 text-zinc-400 max-w-xs">
                                                    <span className="line-clamp-2">
                                                        {click.userAgent ||
                                                            "Unknown"}
                                                    </span>
                                                </td>

                                                <td className="py-4 text-zinc-400">
                                                    {click.referrer ||
                                                        "Direct"}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
}