"use client";

import { useState } from "react";
import { deleteLink } from "../lib/api";

interface Link {
    id: number;
    originalUrl: string;
    shortCode: string;
    createdAt: string;
    expiresAt: string | null;
}

interface LinkListProps {
    links: Link[];
    onViewAnalytics: (shortCode: string) => void;
    onDeleted: (shortCode: string) => void;
}

export default function LinkList({
    links,
    onViewAnalytics,
    onDeleted,
}: LinkListProps) {

    const [copiedCode, setCopiedCode] =
        useState<string | null>(null);

    const [deletingCode, setDeletingCode] =
        useState<string | null>(null);


    async function handleCopy(
        shortCode: string
    ) {

        const shortUrl =
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/${shortCode}`;

        try {

            await navigator.clipboard.writeText(
                shortUrl
            );

            setCopiedCode(shortCode);

            setTimeout(() => {
                setCopiedCode(null);
            }, 2000);

        } catch (error) {

            console.error(
                "Failed to copy URL:",
                error
            );
        }
    }


    async function handleDelete(
        shortCode: string
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this link?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingCode(shortCode);

            await deleteLink(shortCode);

            onDeleted(shortCode);

        } catch (error) {

            console.error(
                "Failed to delete link:",
                error
            );

            alert(
                "Failed to delete link."
            );

        } finally {

            setDeletingCode(null);
        }
    }


    function getExpirationStatus(
        expiresAt: string | null
    ) {

        if (!expiresAt) {

            return {
                text: "Never expires",
                className: "text-green-400",
            };
        }

        const expirationDate =
            new Date(expiresAt);

        const now =
            new Date();

        if (expirationDate <= now) {

            return {
                text: "Expired",
                className: "text-red-400",
            };
        }

        return {
            text:
                `Expires ${expirationDate.toLocaleDateString()}`,
            className: "text-yellow-400",
        };
    }


    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="mb-6">

                <h3 className="text-xl font-semibold">
                    My Links
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                    Manage and view your shortened links.
                </p>

            </div>


            {links.length === 0 ? (

                <div className="py-10 text-center">

                    <p className="text-zinc-400">
                        No shortened links yet.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {links.map((link) => {

                        const shortUrl =
                            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/${link.shortCode}`;

                        const isDeleting =
                            deletingCode ===
                            link.shortCode;

                        const expiration =
                            getExpirationStatus(
                                link.expiresAt
                            );


                        return (
                            <div
                                key={link.id}
                                className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
                            >

                                <p className="text-sm text-zinc-400 mb-1">
                                    Short URL
                                </p>

                                <a
                                    href={shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                                >
                                    {shortUrl}
                                </a>


                                <p className="text-sm text-zinc-400 mt-4 mb-1">
                                    Original URL
                                </p>

                                <p className="text-sm text-zinc-300 break-all">
                                    {link.originalUrl}
                                </p>


                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">

                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-zinc-500">

                                        <span>
                                            Code:{" "}

                                            <span className="text-zinc-300">
                                                {link.shortCode}
                                            </span>
                                        </span>


                                        <span>
                                            Created:{" "}

                                            {new Date(
                                                link.createdAt
                                            ).toLocaleDateString()}
                                        </span>


                                        <span
                                            className={
                                                expiration.className
                                            }
                                        >
                                            {expiration.text}
                                        </span>

                                    </div>


                                    <div className="flex gap-2 flex-wrap">

                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    link.shortCode
                                                )
                                            }
                                            disabled={
                                                isDeleting
                                            }
                                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition disabled:opacity-50"
                                        >
                                            {copiedCode ===
                                            link.shortCode
                                                ? "Copied!"
                                                : "Copy"}
                                        </button>


                                        <button
                                            onClick={() =>
                                                onViewAnalytics(
                                                    link.shortCode
                                                )
                                            }
                                            disabled={
                                                isDeleting
                                            }
                                            className="px-3 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50"
                                        >
                                            Analytics
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    link.shortCode
                                                )
                                            }
                                            disabled={
                                                isDeleting
                                            }
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                                        >
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}