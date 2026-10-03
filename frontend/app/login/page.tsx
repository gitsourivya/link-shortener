"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

    const router = useRouter();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleLogin(
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
                "password",
                password
            );


            const response =
                await fetch(
                    "http://localhost:8080/api/auth/login?" +
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
                    "Invalid username or password"
                );
            }


            const token =
                await response.text();


            localStorage.setItem(
                "token",
                token
            );


            router.push("/");

        } catch (error) {

            if (error instanceof Error) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Login failed"
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
                        Welcome Back
                    </h1>

                    <p className="text-gray-400">
                        Login to manage your links.
                    </p>

                </div>


                <form
                    onSubmit={handleLogin}
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
                        placeholder="Enter username"
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
                        placeholder="Enter password"
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>


                    {error && (
                        <p className="text-red-400 mt-4 text-sm">
                            {error}
                        </p>
                    )}


                    <p className="text-center text-sm text-gray-500 mt-6">

                        Don't have an account?{" "}

                        <Link
                            href="/register"
                            className="text-white hover:underline"
                        >
                            Register
                        </Link>

                    </p>

                </form>

            </div>

        </main>
    );
}