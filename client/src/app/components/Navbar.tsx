"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { user, token } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                withCredentials: true,
            });
        } catch (err) {
            console.log("Logout request failed:", err);
        }

        dispatch(logout());

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    };


    return (
        <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">

            <Link href="/" className="text-xl font-bold text-blue-600">
                Apartment Finder
            </Link>

            <div className="flex gap-4 items-center">


                {!token ? (
                    <>
                        <Link
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="text-blue-500 hover:underline"
                        >
                            Register
                        </Link>
                    </>
                ) : (

                    <>

                        <Link
                            href="/apartments/create"
                            className="mr-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            + Create Apartment
                        </Link>

                        <span className="text-gray-700">
                            Welcome, <b>{user?.username}</b>
                        </span>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>
        </nav>
    );
}
