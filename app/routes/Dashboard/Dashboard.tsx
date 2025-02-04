import type { Route } from "../../+types/root";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard" },
        { name: "description", content: "Dashboard" },
    ];
}

export default function Dashboard() {
    return (
        <div className="bg-white rounded-lg h-full border-gray-300">
            <div className="border-b border-gray-200 p-3">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <div className="p-6">

            </div>
        </div>
    );
}
