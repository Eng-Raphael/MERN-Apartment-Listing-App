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
    const [loading, setLoading] = useState(false);

    // Handle image drop or selection
    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;

        const arr = Array.from(files);

        const updatedList = [...imagesPreview, ...arr];

        if (updatedList.length > 7) {
            setApiError("Maximum 7 images allowed");
            return;
        }

        setImagesPreview(updatedList);
        formik.setFieldValue("imagesCount", updatedList.length);
    };


    const removeImage = (index: number) => {
        const updated = imagesPreview.filter((_, i) => i !== index);
        setImagesPreview(updated);
        formik.setFieldValue("imagesCount", updated.length);
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
            imagesCount: 0,
        },

        validationSchema: Yup.object({
            title: Yup.string()
                .required("Title is required")
                .min(5, "Title must be at least 5 characters"),

            referenceNo: Yup.string()
                .required("Reference number is required")
                .test(
                    "unique-ref",
                    "Reference number already exists",
                    async function (value) {
                        if (!value) return false;

                        try {
                            const res = await axios.get(
                                `http://localhost:5001/api/apartments/check-reference`,
                                { params: { referenceNo: value } }
                            );

                            return !res.data.exists;
                        } catch (e) {
                            return true;
                        }
                    }
                ),

            bedrooms: Yup.number()
                .required("Bedrooms is required")
                .min(1, "Bedrooms must be at least 1"),

            bathrooms: Yup.number()
                .required("Bathrooms is required")
                .min(1, "Bathrooms must be at least 1"),

            deliverIn: Yup.number()
                .required("Delivery year is required")
                .min(2025, "Delivery year cannot be before 2025"),

            compound: Yup.string()
                .required("Compound name is required"),

            finished: Yup.string()
                .oneOf(["FULLY", "HALF"])
                .required("Finish status is required"),

            locationDescription: Yup.string().required("Location description is required"),

            lat: Yup.number()
                .required("Latitude is required")
                .min(-90, "Latitude cannot be less than -90")
                .max(90, "Latitude cannot be greater than 90"),

            long: Yup.number()
                .required("Longitude is required")
                .min(-180, "Longitude cannot be less than -180")
                .max(180, "Longitude cannot be greater than 180"),

            imagesCount: Yup.number()
                .required("Please upload at least one image")
                .min(1, "At least one image is required")
                .max(7, "Maximum 7 images are allowed"),
        }),


        onSubmit: async (values) => {
            setApiError("");
            setLoading(true);

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
                formDataToSend.append("amenities[undergroundParking]", values.undergroundParking ? "true" : "false");
                formDataToSend.append("amenities[medicalCare]", values.medicalCare ? "true" : "false");
                formDataToSend.append("amenities[commercialStrip]", values.commercialStrip ? "true" : "false");
                formDataToSend.append("amenities[businessHub]", values.businessHub ? "true" : "false");
                formDataToSend.append("amenities[outdoorPool]", values.outdoorPool ? "true" : "false");
                formDataToSend.append("amenities[joggingTrails]", values.joggingTrails ? "true" : "false");

                if (values.imagesCount === 0) {
                    formik.setFieldTouched("imagesCount", true);
                    return;
                }

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
            }finally {
                setLoading(false);
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
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
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
                {formik.touched.title && formik.errors.title && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.title}</p>
                )}


                {/* REFERENCE NO */}
                <label className="block mt-4 font-medium">Reference No</label>
                <input
                    name="referenceNo"
                    type="text"
                    value={formik.values.referenceNo}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />
                {formik.touched.referenceNo && formik.errors.referenceNo && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.referenceNo}</p>
                )}


                {/* BEDROOMS */}
                <label className="block mt-4 font-medium">Bedrooms</label>
                <input
                    name="bedrooms"
                    type="number"
                    value={formik.values.bedrooms}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />
                {formik.touched.bedrooms && formik.errors.bedrooms && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.bedrooms}</p>
                )}


                {/* BATHROOMS */}
                <label className="block mt-4 font-medium">Bathrooms</label>
                <input
                    name="bathrooms"
                    type="number"
                    value={formik.values.bathrooms}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />
                {formik.touched.bathrooms && formik.errors.bathrooms && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.bathrooms}</p>
                )}


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
                {formik.touched.deliverIn && formik.errors.deliverIn && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.deliverIn}</p>
                )}

                {/* COMPOUND */}
                <label className="block mt-4 font-medium">Compound</label>
                <input
                    name="compound"
                    type="text"
                    value={formik.values.compound}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />
                {formik.touched.compound && formik.errors.compound && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.compound}</p>
                )}

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
                {formik.touched.finished && formik.errors.finished && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.finished}</p>
                )}

                {/* LOCATION */}
                <label className="block mt-6 font-medium">Location Description</label>
                <input
                    name="locationDescription"
                    type="text"
                    value={formik.values.locationDescription}
                    onChange={formik.handleChange}
                    className="w-full border px-4 py-2 rounded text-black"
                />
                {formik.touched.locationDescription && formik.errors.locationDescription && (
                    <p className="text-red-600 text-sm mt-1">
                        {formik.errors.locationDescription}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <input
                        name="lat"
                        type="number"
                        min={-90}
                        max={90}
                        placeholder="Latitude"
                        value={formik.values.lat}
                        onChange={formik.handleChange}
                        className="w-full border px-4 py-2 rounded text-black"
                    />
                    <input
                        name="long"
                        type="number"
                        min={-180}
                        max={180}
                        placeholder="Longitude"
                        value={formik.values.long}
                        onChange={formik.handleChange}
                        className="w-full border px-4 py-2 rounded text-black"
                    />

                    {formik.touched.lat && formik.errors.lat && (
                        <p className="text-red-600 text-sm mt-1">{formik.errors.lat}</p>
                    )}

                    {formik.touched.long && formik.errors.long && (
                        <p className="text-red-600 text-sm mt-1">{formik.errors.long}</p>
                    )}


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
                            onChange={(e) =>
                                formik.setFieldValue(amenity, e.target.checked)
                            }
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
                    {formik.touched.imagesCount && formik.errors.imagesCount && (
                        <p className="text-red-600 text-sm mt-1">{formik.errors.imagesCount}</p>
                    )}
                </div>

                {/* Preview */}
                <div className="flex gap-4 mt-4 overflow-x-auto">
                    {imagesPreview.map((img, i) => (
                        <div key={i} className="relative">
                    <img
                        src={URL.createObjectURL(img)}
                        className="w-32 h-24 object-cover rounded-lg shadow"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6
                           rounded-full flex items-center justify-center text-xs"
                    >
                        ✕
                    </button>
                </div>
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
