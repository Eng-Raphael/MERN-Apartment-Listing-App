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
            const res = await axios.get(`http://localhost:5001/api/apartments/${id}`, {
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

            {/* IMAGES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {apartment.images.map((img: string, i: number) => (
                    <img
                        key={i}
                        src={img}
                        className="rounded-lg shadow-md w-full h-56 object-cover"
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

            {/* AMENITIES */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Amenities</h2>
                <ul className="list-disc ml-5 mt-2">
                    {Object.entries(apartment.amenities)
                        .filter(([_, val]) => val === true)
                        .map(([key]) => (
                            <li key={key} className="capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                            </li>
                        ))}
                </ul>
            </div>

        </div>
    );
}
