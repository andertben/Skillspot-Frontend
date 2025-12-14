import type {KategorieDto} from "../dto/KategorieDto.ts";

const BASE_URL = 'http://localhost:8080';

export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);

    if (!response.ok) {
        throw new Error('Fehler beim Laden der Kategorien');
    }
    const json = await response.json();

    return json as KategorieDto[];
}
