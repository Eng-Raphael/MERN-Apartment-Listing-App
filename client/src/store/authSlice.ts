
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null, // we'll fill this from login later
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string | null }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
