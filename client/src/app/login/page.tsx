"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [apiError, setApiError] = useState("");

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required"),
        }),

        onSubmit: async (values) => {
            setApiError("");

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                    values,
                    { withCredentials: true }
                );


                dispatch(
                    setCredentials({
                        user: res.data.user,
                        token: res.data.token,
                    })
                );


                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                router.push("/");
            } catch (err: any) {
                console.log(err);
                setApiError(
                    err.response?.data?.errors
                        ? err.response.data.errors[0]
                        : "Login failed"
                );
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Login
                </h1>

                {apiError && (
                    <p className="text-red-600 text-sm text-center mb-3">
                        {apiError}
                    </p>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <label className="block text-sm font-medium text-black">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        className="w-full mt-1 mb-2 px-4 py-2 border rounded-lg placeholder-gray-500 text-black"
                        placeholder="rafy"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.username && (
                        <p className="text-red-600 text-sm">
                            {formik.errors.username}
                        </p>
                    )}

                    <label className="block text-sm font-medium mt-3 text-black">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full mt-1 mb-2 px-4 py-2 border rounded-lg placeholder-gray-500 text-black"
                        placeholder="********"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password && (
                        <p className="text-red-600 text-sm">
                            {formik.errors.password}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
