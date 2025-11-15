"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
type Apartment = any;

export default function ApartmentsPage() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState<Apartment[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [compoundFilter, setCompoundFilter] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    const [compounds, setCompounds] = useState([]);
    let timeoutId: any = null;

    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchCompounds = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments/compounds/list`);
            setCompounds(res.data.data);
        };

        fetchCompounds();
    }, []);


    const applySort = (list: Apartment[]) => {
        let sorted = [...list];

        if (sortBy === "title") {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "deliver") {
            sorted.sort((a, b) => a.deliverIn - b.deliverIn);
        } else {
            sorted.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        setFiltered(sorted);
    };


    const applyCompound = async (value: string) => {
        setCompoundFilter(value);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments/search`, {
            params: { search: searchQuery, compound: value },
        });

        applySort(res.data.data);
    };


    const handleSearch = (value: string) => {
        setSearchQuery(value);

        clearTimeout(timeoutId);

        timeoutId = setTimeout(async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments/search`, {
                params: { search: value, compound: compoundFilter },
            });

            applySort(res.data.data);
        }, 300);
    };


    useEffect(() => {
        applySort(filtered);
    }, [sortBy]);


    useEffect(() => {
        const fetchApts = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments`);
                setApartments(res.data.data);
                setFiltered(res.data.data);
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

            <div className="bg-white p-5 rounded-lg shadow mb-8 border">
                <h2 className="text-xl font-semibold mb-4 text-black">🔍 Search Apartments</h2>

                <div className="flex flex-col md:flex-row gap-4">

                    {/* SEARCH INPUT */}
                    <input
                        type="text"
                        placeholder="Search by title, reference, compound..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="border px-4 py-2 rounded w-full text-black"
                    />

                    {/* COMPOUND FILTER */}
                    <select
                        value={compoundFilter}
                        onChange={(e) => applyCompound(e.target.value)}
                        className="border px-4 py-2 rounded text-black"
                    >
                        <option value="">All Compounds</option>

                        {compounds.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* SORT */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border px-4 py-2 rounded text-black"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="title">Title A-Z</option>
                        <option value="deliver">Delivery Year</option>
                    </select>
                </div>

                {/* FILTER CHIPS */}
                <div className="flex gap-3 mt-3 flex-wrap">
                    {searchQuery && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                Search: {searchQuery}
                            <button onClick={() => handleSearch("")} className="ml-2">✕</button>
            </span>
                    )}

                    {compoundFilter && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Compound: {compoundFilter}
                            <button onClick={() => applyCompound("")} className="ml-2">✕</button>
            </span>
                    )}
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((apt) => (
                    <Link
                        key={apt._id}
                        href={user ? `/apartments/${apt._id}` : `/login?redirect=/apartments/${apt._id}`}
                    >
                        <div className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer bg-white text-black">

                            {/* IMAGE */}
                            <img
                                src={apt.images?.length ? apt.images[0] : "/no-image.jpg"}
                                className="w-full h-40 object-cover rounded-md"
                            />

                            <h2 className="mt-2 font-semibold text-lg">{apt.title}</h2>
                            <p className="text-sm text-gray-500">{apt.location?.description}</p>

                            {/* BASIC INFO */}
                            <div className="text-sm mt-2 text-gray-700">
                                <p><b>Bedrooms:</b> {apt.bedrooms}</p>
                                <p><b>Bathrooms:</b> {apt.bathrooms}</p>
                                <p><b>Compound:</b> {apt.compound}</p>
                                <p><b>Delivery:</b> {apt.deliverIn}</p>
                                <p><b>Finish:</b> {apt.finished}</p>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
