'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/apiClient';
import axios from 'axios';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'admin';
}

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name should be at least 2 characters')
        .max(30, 'First name too long')
        .matches(/[A-Za-z]/, "First name must include at least two letter — numbers only are not allowed"),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name should be at least 2 characters')
        .max(30, 'Last name too long')
        .matches(/[A-Za-z]/, "Last name must include at least two letter — numbers only are not allowed"),
    username: Yup.string()
        .min(3, "Username should be at least 3 characters")
        .required("Username is required")
        .test(
            "unique-username",
            "Username already exists",
            async function (value) {
                if (!value) return false;

                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-username`,
                        { params: { username: value } }
                    );

                    return !res.data.exists;
                } catch (e) {
                    return true;
                }
            }
        ),
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required")
        .matches(/\.com$/, "Email must end with .com")
        .matches(
            /@(gmail|yahoo|hotmail|outlook)\.com$/,
            "Email must be one of: @gmail.com, @yahoo.com, @hotmail.com, or @outlook.com"
        )
        .test(
            "unique-email",
            "Email already exists",
            async function (value) {
                if (!value) return false;

                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-email`,
                        { params: { email: value } }
                    );

                    return !res.data.exists;
                } catch (e) {
                    return true;
                }
            }
        ),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character !@#$%^&*(),.?\":{}|<>"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    role: Yup.mixed<'user' | 'admin'>()
        .oneOf(['user', 'admin'])
        .required(),
});

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const initialValues: RegisterFormValues = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    };

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            setServerError(null);

            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                email: values.email,
                password: values.password,
                role: values.role,
            };

            const res = await api.post('/auth/register', payload);

            if (res.data?.success) {

                router.push('/login');
            } else {
                setServerError(res.data?.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error(error);
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.errors?.[0] ||
                'Registration failed';
            setServerError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Create your account
                </h1>

                {serverError && (
                    <div className="mb-4 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm">
                        {serverError}
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    First Name
                                </label>
                                <Field
                                    name="firstName"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Raphael"
                                />
                                <ErrorMessage
                                    name="firstName"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Last Name
                                </label>
                                <Field
                                    name="lastName"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Alfy"
                                />
                                <ErrorMessage
                                    name="lastName"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Username
                                </label>
                                <Field
                                    name="username"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="rafy"
                                />
                                <ErrorMessage
                                    name="username"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="********"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="********"
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
