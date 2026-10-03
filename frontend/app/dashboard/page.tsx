"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getAllLinks } from "../../lib/api";
import LinkList from "../../components/LinkList";

interface LinkData {
    id: number;
    originalUrl: string;
    shortCode: string;
    createdAt: string;
    expiresAt: string | null;
}

export default function Dashboard() {

    const router = useRouter();

    const [links, setLinks] =
        useState<LinkData[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            router.push("/login");

            return;
        }

        loadLinks();

    }, []);


    async function loadLinks() {

        try {

            setLoading(true);

            setError("");

            const data =
                await getAllLinks();

            setLinks(data);

        } catch (error) {

            console.error(
                "Failed to load links:",
                error
            );

            if (error instanceof Error) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Failed to load links."
                );
            }

        } finally {

            setLoading(false);
        }
    }


    function handleViewAnalytics(
        shortCode: string
    ) {

        router.push(
            `/analytics?code=${encodeURIComponent(
                shortCode
            )}`
        );
    }


    function handleDeleted(
        shortCode: string
    ) {

        setLinks((currentLinks) =>
            currentLinks.filter(
                (link) =>
                    link.shortCode !==
                    shortCode
            )
        );
    }


    if (loading) {

        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">

                <p className="text-zinc-400">
                    Loading your links...
                </p>

            </main>
        );
    }


    if (error) {

        return (
            <main className="min-h-screen bg-black text-white px-6 py-10">

                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center justify-between mb-10">

                        <div>

                            <h1 className="text-3xl font-bold">
                                My Links
                            </h1>

                            <p className="text-zinc-500 mt-2">
                                Manage your shortened URLs.
                            </p>

                        </div>

                        <Link
                            href="/"
                            className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200"
                        >
                            Create Link
                        </Link>

                    </div>


                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <p className="text-red-400 mb-5">
                            {error}
                        </p>

                        <button
                            onClick={loadLinks}
                            className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">

            <div className="max-w-5xl mx-auto">

                {/* Header */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">

                    <div>

                        <h1 className="text-3xl font-bold">
                            My Links
                        </h1>

                        <p className="text-zinc-500 mt-2">
                            Manage your shortened URLs and view their analytics.
                        </p>

                    </div>


                    <Link
                        href="/"
                        className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200"
                    >
                        Create New Link
                    </Link>

                </div>


                {/* Link Count */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">

                    <p className="text-sm text-zinc-500">
                        Total Links
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {links.length}
                    </p>

                </div>


                {/* Link List */}

                <LinkList
                    links={links}
                    onViewAnalytics={
                        handleViewAnalytics
                    }
                    onDeleted={
                        handleDeleted
                    }
                />

            </div>

        </main>
    );
}