"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { setYear } from "date-fns";


export default function CreateApartmentForm() {
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.token);
    const [successMsg, setSuccessMsg] = useState("");
    const [imagesPreview, setImagesPreview] = useState<File[]>([]);
    const [apiError, setApiError] = useState("");

    // Handle image drop or selection
    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;

        const arr = Array.from(files);
        setImagesPreview(arr);
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            referenceNo: "",
            bedrooms: "",
            bathrooms: "",
            deliverIn: "",
            compound: "",
            finished: "FULLY",
            locationDescription: "",
            lat: "",
            long: "",
            undergroundParking: false,
            medicalCare: false,
            commercialStrip: false,
            businessHub: false,
            outdoorPool: false,
            joggingTrails: false,
        },

        validationSchema: Yup.object({
            title: Yup.string().min(5).required(),
            referenceNo: Yup.string().required(),
            bedrooms: Yup.number().min(1).required(),
            bathrooms: Yup.number().min(1).required(),
            deliverIn: Yup.number()
                .min(new Date().getFullYear(), `Year cannot be before ${new Date().getFullYear()}`)
                .required(),
            compound: Yup.string().required(),
            finished: Yup.string().oneOf(["FULLY", "HALF"]).required(),
            locationDescription: Yup.string().required(),
            lat: Yup.number().required(),
            long: Yup.number().required(),
        }),

        onSubmit: async (values) => {
            setApiError("");

            try {
                const formDataToSend = new FormData();

                // Normal fields
                formDataToSend.append("title", values.title);
                formDataToSend.append("referenceNo", values.referenceNo);
                formDataToSend.append("bedrooms", values.bedrooms.toString());
                formDataToSend.append("bathrooms", values.bathrooms.toString());
                formDataToSend.append("deliverIn", values.deliverIn.toString());
                formDataToSend.append("compound", values.compound);
                formDataToSend.append("finished", values.finished);

                // Location (nested)
                formDataToSend.append("location[description]", values.locationDescription);
                formDataToSend.append("location[lat]", values.lat.toString());
                formDataToSend.append("location[long]", values.long.toString());

                // Amenities (nested booleans)
                formDataToSend.append("amenities[undergroundParking]", String(values.undergroundParking));
                formDataToSend.append("amenities[medicalCare]", String(values.medicalCare));
                formDataToSend.append("amenities[commercialStrip]", String(values.commercialStrip));
                formDataToSend.append("amenities[businessHub]", String(values.businessHub));
                formDataToSend.append("amenities[outdoorPool]", String(values.outdoorPool));
                formDataToSend.append("amenities[joggingTrails]", String(values.joggingTrails));

                // Images
                for (let i = 0; i < imagesPreview.length; i++) {
                    formDataToSend.append("images", imagesPreview[i]);
                }

                const res = await axios.post(
                    "http://localhost:5001/api/apartments/create",
                    formDataToSend,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );

                setSuccessMsg("Apartment created successfully!");
                formik.resetForm();
                setImagesPreview([]);

                setTimeout(() => {
                    router.push("/apartments");
                }, 1000);
            } catch (err: any) {
                console.log(err);
                setApiError("Failed to create apartment");
            }
        },

    });

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md text-black">

            <h1 className="text-3xl font-bold mb-6">Create New Apartment</h1>

            {apiError && (
                <p className="text-red-600 text-sm mb-4">{apiError}</p>
            )}

            {successMsg && (
                <p className="text-green-600 text-sm mb-4">{successMsg}</p>
            )}

            <form onSubmit={formik.handleSubmit}>
                {/* TITLE */}
                <label className="block mt-4 font-medium">Title</label>
                <input
                    name="title"
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                {/* REFERENCE NO */}
                <label className="block mt-4 font-medium">Reference No</label>
                <input
                    name="referenceNo"
                    type="text"
                    value={formik.values.referenceNo}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                {/* BEDROOMS */}
                <label className="block mt-4 font-medium">Bedrooms</label>
                <input
                    name="bedrooms"
                    type="number"
                    value={formik.values.bedrooms}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                {/* BATHROOMS */}
                <label className="block mt-4 font-medium">Bathrooms</label>
                <input
                    name="bathrooms"
                    type="number"
                    value={formik.values.bathrooms}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                {/* Deliver in */}
                <label className="block mt-4 font-medium">Delivery Year</label>
                <div className="w-full">
                    <DatePicker
                        selected={
                            formik.values.deliverIn
                                ? setYear(new Date(), Number(formik.values.deliverIn))
                                : null
                        }
                        onChange={(date: Date | null) => {
                            if (date) {
                                formik.setFieldValue("deliverIn", date.getFullYear());
                            }
                        }}
                        showYearPicker
                        dateFormat="yyyy"
                        className="w-full border px-4 py-2 rounded text-black"
                        minDate={new Date(new Date().getFullYear(), 0, 1)} // cannot pick past years
                        placeholderText="Select Delivery Year"
                    />
                </div>
                {/* COMPOUND */}
                <label className="block mt-4 font-medium">Compound</label>
                <input
                    name="compound"
                    type="text"
                    value={formik.values.compound}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                {/* FINISHED */}
                <label className="block mt-4 font-medium">Finished</label>
                <select
                    name="finished"
                    value={formik.values.finished}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                >
                    <option value="FULLY">FULLY</option>
                    <option value="HALF">HALF</option>
                </select>

                {/* LOCATION */}
                <label className="block mt-6 font-medium">Location Description</label>
                <input
                    name="locationDescription"
                    type="text"
                    value={formik.values.locationDescription}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <input
                        name="lat"
                        type="number"
                        placeholder="Latitude"
                        value={formik.values.lat}
                        onChange={formik.handleChange}
                        className="w-full border px-4 py-2 rounded text-black"
                    />
                    <input
                        name="long"
                        type="number"
                        placeholder="Longitude"
                        value={formik.values.long}
                        onChange={formik.handleChange}
                        className="w-full border px-4 py-2 rounded text-black"
                    />
                </div>

                {/* AMENITIES */}
                <h2 className="text-xl font-semibold mt-6">Amenities</h2>

                {[
                    "undergroundParking",
                    "medicalCare",
                    "commercialStrip",
                    "businessHub",
                    "outdoorPool",
                    "joggingTrails",
                ].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name={amenity}
                            checked={(formik.values as any)[amenity]}
                            onChange={formik.handleChange}
                        />
                        {amenity.replace(/([A-Z])/g, " $1")}
                    </label>
                ))}

                {/* IMAGES UPLOAD */}
                <label className="block mt-6 font-medium">Images</label>

                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleImageUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer"
                    onClick={() => document.getElementById("imagesInput")?.click()}
                >
                    <p className="text-gray-600">Drag & Drop images OR click to upload</p>
                    <input
                        id="imagesInput"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                    />
                </div>

                {/* Preview */}
                <div className="flex gap-4 mt-4 overflow-x-auto">
                    {imagesPreview.map((img, i) => (
                        <img
                            key={i}
                            src={URL.createObjectURL(img)}
                            className="w-32 h-24 object-cover rounded-lg shadow"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full"
                >
                    Create Apartment
                </button>
            </form>
        </div>
    );
}
