"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full px-6 py-4 bg-white shadow-sm flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
                Apartment Listing App
            </Link>

            <div className="space-x-4">
                <Link href="/register" className="text-gray-700 hover:text-blue-600">
                    Register
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                </Link>
            </div>
        </nav>
    );
}
