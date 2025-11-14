//
// 'use client';
//
// import { Provider } from 'react-redux';
// import { store } from '@/store/store';
//
// export default function ReduxProvider({ children }: { children: React.ReactNode }) {
//     return <Provider store={store}>{children}</Provider>;
// }
"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {

    // Rehydrate Redux from localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            store.dispatch(setCredentials({
                user: JSON.parse(user),
                token: token
            }));
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
