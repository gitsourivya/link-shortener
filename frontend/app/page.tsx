"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LinkForm from "../components/LinkForm";

export default function Home() {

    const [shortUrl, setShortUrl] =
        useState("");

    const [shortCode, setShortCode] =
        useState("");

    const [loggedIn, setLoggedIn] =
        useState(false);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        setLoggedIn(
            Boolean(token)
        );

    }, []);

    function handleCreated(
        shortCode: string
    ) {

        setShortCode(
            shortCode
        );

        setShortUrl(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/${shortCode}`
        );
    }

    function handleLogout() {

        localStorage.removeItem(
            "token"
        );

        setLoggedIn(false);

        window.location.href =
            "/login";
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">

            <div className="max-w-4xl mx-auto">

                {/* Navigation */}

                <div className="flex justify-end gap-3 mb-8">

                    {loggedIn ? (

                        <>
                            <Link
                                href="/dashboard"
                                className="bg-zinc-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Logout
                            </button>
                        </>

                    ) : (

                        <>
                            <Link
                                href="/login"
                                className="bg-zinc-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Register
                            </Link>
                        </>

                    )}

                </div>

                {/* Header */}

                <div className="text-center mb-12">

                    <h1 className="text-5xl font-bold mb-4">
                        Link Shortener
                    </h1>

                    <p className="text-gray-400">
                        Create short links and track their analytics.
                    </p>

                </div>

                {/* Link Form */}

                <LinkForm
                    onCreated={handleCreated}
                />

                {/* Created URL */}

                {shortUrl && (

                    <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                        <p className="text-sm text-gray-400 mb-2">
                            Your short URL
                        </p>

                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all text-lg"
                        >
                            {shortUrl}
                        </a>

                        <div className="mt-6">

                            <Link
                                href={`/analytics?code=${encodeURIComponent(
                                    shortCode
                                )}`}
                                className="inline-block bg-white text-black px-5 py-3 rounded-lg font-medium hover:bg-gray-200"
                            >
                                View Analytics
                            </Link>

                        </div>

                    </div>

                )}

            </div>

        </main>
    );
}