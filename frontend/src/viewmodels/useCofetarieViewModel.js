import { useEffect, useState } from "react";
import { Cofetarie } from "../models/Cofetarie";

export function useCofetarieViewModel() {
    const [cofetarii, setCofetarii] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8085/cofetarie")
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setCofetarii(data.map(c => new Cofetarie(c)));
                setLoading(false);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                setLoading(false);
            });
    }, []);

    return { cofetarii, loading };
}
