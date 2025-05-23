import { useCofetarieViewModel } from "../viewmodels/useCofetarieViewModel";

export default function CofetarieList() {
    const { cofetarii, loading } = useCofetarieViewModel();

    if (loading) return <p>Se incarcă...</p>;

    return (
        <ul>
            {cofetarii.map(c => (
                <li key={c.id}>{c.adresa}</li>
            ))}
        </ul>
    );
}