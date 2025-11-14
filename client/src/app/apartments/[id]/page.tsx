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
            <h1 className="text-3xl font-bold mb-4">{apartment.title}</h1>

            <img src={apartment.images[0]} className="w-full max-w-xl rounded-lg shadow" />

            <h3 className="mt-4 font-semibold">Location:</h3>
            <p>{apartment.location.description}</p>

            <div className="mt-4">
                <p><b>Bedrooms:</b> {apartment.bedrooms}</p>
                <p><b>Bathrooms:</b> {apartment.bathrooms}</p>
                <p><b>Compound:</b> {apartment.compound}</p>
            </div>
        </div>
    );
}
