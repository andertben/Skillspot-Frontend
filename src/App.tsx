import { useEffect, useState } from "react";
import { getCategories } from "./service/KategorieService.ts";
import type {KategorieDto} from "./dto/KategorieDto.ts";

function App() {
    const [kategorien, setKategorien] = useState<KategorieDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCategories()
            .then(data => setKategorien(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div>
            <h1>Kategorien</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {kategorien.map(kategorie => (
                    <li key={kategorie.kategorie_id}>
                        {kategorie.bezeichnung}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
