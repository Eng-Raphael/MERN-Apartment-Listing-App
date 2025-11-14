"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ApartmentsPage() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchApts = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/apartments");
                setApartments(res.data.data);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchApts();
    }, []);

    if (loading) return <p className="text-center mt-20 text-black">Loading...</p>;

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-5 text-black">Available Apartments</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {apartments.map((apt: any) => (
                    <Link
                        key={apt._id}
                        href={user ? `/apartments/${apt._id}` : `/login?redirect=/apartments/${apt._id}`}
                    >
                        <div className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer bg-white text-black">
                            <img
                                src={apt.images?.[0]}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h2 className="mt-2 font-semibold">{apt.title}</h2>
                            <p className="text-sm text-gray-600">{apt.location?.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
