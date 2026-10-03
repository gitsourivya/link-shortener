"use client";

import { useState } from "react";
import { createShortUrl } from "../lib/api";

interface LinkFormProps {
    onCreated: (shortCode: string) => void;
}

export default function LinkForm({
    onCreated,
}: LinkFormProps) {

    const [originalUrl, setOriginalUrl] =
        useState("");

    const [customAlias, setCustomAlias] =
        useState("");

    const [expirationDays, setExpirationDays] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();


        if (!originalUrl.trim()) {

            setError(
                "Please enter a URL"
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            const data =
                await createShortUrl(
                    originalUrl,
                    customAlias.trim() ||
                    undefined,
                    expirationDays
                        ? Number(expirationDays)
                        : undefined
                );


            onCreated(
                data.shortCode
            );


            setOriginalUrl("");

            setCustomAlias("");

            setExpirationDays("");

        } catch (error) {

            if (
                error instanceof Error &&
                error.message
            ) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Failed to create short URL"
                );
            }

        } finally {

            setLoading(false);
        }
    }


    return (

        <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >

            {/* Original URL */}

            <label className="block text-sm text-gray-400 mb-2">
                Enter your URL
            </label>

            <input
                type="url"
                value={originalUrl}
                onChange={(e) =>
                    setOriginalUrl(
                        e.target.value
                    )
                }
                placeholder="https://example.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
            />


            {/* Custom Alias */}

            <label className="block text-sm text-gray-400 mt-5 mb-2">
                Custom Alias
                <span className="text-zinc-600 ml-2">
                    Optional
                </span>
            </label>

            <div className="flex items-center">

                <span className="bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-lg px-3 py-3 text-sm text-zinc-500">
                   {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/
                </span>

                <input
                    type="text"
                    value={customAlias}
                    onChange={(e) =>
                        setCustomAlias(
                            e.target.value
                        )
                    }
                    placeholder="my-link"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-r-lg px-4 py-3 outline-none focus:border-white"
                />

            </div>


            {/* Expiration */}

            <label className="block text-sm text-gray-400 mt-5 mb-2">
                Link Expiration
            </label>

            <select
                value={expirationDays}
                onChange={(e) =>
                    setExpirationDays(
                        e.target.value
                    )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
            >

                <option value="">
                    Never expires
                </option>

                <option value="7">
                    7 days
                </option>

                <option value="30">
                    30 days
                </option>

                <option value="90">
                    90 days
                </option>

            </select>


            {/* Submit */}

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
            >

                {loading
                    ? "Creating..."
                    : "Shorten URL"}

            </button>


            {/* Error */}

            {error && (

                <p className="text-red-400 mt-4 text-sm">
                    {error}
                </p>

            )}

        </form>
    );
}