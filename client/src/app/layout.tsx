import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import Navbar from "./components/Navbar";

export const metadata = {
    title: "Apartment Listing App",
    description: "Full-stack task",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-gray-100">
        <ReduxProvider>
            <Navbar />
            <main className="pt-6">{children}</main>
        </ReduxProvider>
        </body>
        </html>
    );
}
