import type { Route } from "../../+types/root";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Keuangan" },
        { name: "description", content: "Keuangan" },
    ];
}

export default function BookKeeping() {
    return (
        <div>
            <h1 className="text-3xl font-bold underline">Keuangan</h1>
        </div>
    );
}
