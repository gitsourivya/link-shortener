"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

    const router = useRouter();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleRegister(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const params =
                new URLSearchParams();

            params.append(
                "username",
                username
            );

            params.append(
                "email",
                email
            );

            params.append(
                "password",
                password
            );


            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register?` +
                    params.toString(),
                    {
                        method: "POST",
                    }
                );


            if (!response.ok) {

                const errorData =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Registration failed"
                );
            }


            router.push("/login");

        } catch (error) {

            if (error instanceof Error) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Registration failed"
                );
            }

        } finally {

            setLoading(false);
        }
    }


    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold mb-3">
                        Create Account
                    </h1>

                    <p className="text-gray-400">
                        Create an account to manage your links.
                    </p>

                </div>


                <form
                    onSubmit={handleRegister}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >

                    <label className="block text-sm text-gray-400 mb-2">
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        placeholder="Choose a username"
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
                    />


                    <label className="block text-sm text-gray-400 mt-5 mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        placeholder="Enter your email"
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
                    />


                    <label className="block text-sm text-gray-400 mt-5 mb-2">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>


                    {error && (
                        <p className="text-red-400 mt-4 text-sm">
                            {error}
                        </p>
                    )}


                    <p className="text-center text-sm text-gray-500 mt-6">

                        Already have an account?{" "}

                        <Link
                            href="/login"
                            className="text-white hover:underline"
                        >
                            Login
                        </Link>

                    </p>

                </form>

            </div>

        </main>
    );
}