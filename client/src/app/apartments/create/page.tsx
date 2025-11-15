import { cookies } from "next/headers";
import CreateApartmentForm from "../../components/CreateApartmentForm";

export default function CreateApartmentPage() {
    const token = cookies().get("token")?.value;

    if (!token) {

        return (
            <div className="min-h-screen flex items-center justify-center text-black">
                <h1 className="text-xl font-semibold">
                    Unauthorized. Please log in first.
                </h1>
            </div>
        );
    }

    return <CreateApartmentForm />;
}
