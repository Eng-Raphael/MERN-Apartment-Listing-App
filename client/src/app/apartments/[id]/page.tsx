"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ApartmentDetails() {
    const { id } = useParams();
    const router = useRouter();

    const { token } = useSelector((state: RootState) => state.auth);
    const [apartment, setApartment] = useState<any>(null);

    useEffect(() => {
        if (!token) {
            router.push(`/login?redirect=/apartments/${id}`);
            return;
        }

        const fetchApt = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApartment(res.data.data);
        };

        fetchApt();
    }, [id, token]);

    if (!apartment) return <p className="text-center mt-20 text-black">Loading...</p>;

    return (
        <div className="p-10 text-black">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-6">{apartment.title}</h1>

            {/* Apartment Images - horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mt-4">
                {apartment.images.map((img: string, i: number) => (
                    <img
                        key={i}
                        src={img}
                        className="w-80 h-56 object-cover rounded-lg shadow-md flex-shrink-0"
                    />
                ))}
            </div>


            {/* DETAILS */}
            <div className="space-y-2 text-lg">
                <p><b>Reference No:</b> {apartment.referenceNo}</p>
                <p><b>Compound:</b> {apartment.compound}</p>
                <p><b>Finish:</b> {apartment.finished}</p>
                <p><b>Bedrooms:</b> {apartment.bedrooms}</p>
                <p><b>Bathrooms:</b> {apartment.bathrooms}</p>
                <p><b>Delivery Year:</b> {apartment.deliverIn}</p>
            </div>

            {/* LOCATION */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Location</h2>
                <p className="mt-2">{apartment.location.description}</p>

                <p className="text-sm text-gray-600">
                    Lat: {apartment.location.lat} — Long: {apartment.location.long}
                </p>
            </div>

            {/* Amenities Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Amenities</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(apartment.amenities).map(([key, val]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                        >
                            {/* Amenity Name */}
                            <span className="capitalize font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                </span>

                            {/* Status Badge */}
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    val
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                }`}
                            >
                    {val ? "Available" : "Not Available"}
                </span>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
