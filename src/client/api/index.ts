import { Position } from "models/Position";
import axios from "axios";

type PageSearch<T> = {
    item: T;
    count: number;
}

type SearchCriteria = {
    image?: string;
    strokes?: Position[][];
    stroke?: Position[];
    radicals?: string[];
    fourCode: string;
    strokeCount?: number;
    page: number;
    pageSize: number;
}

export const getCharacters = async (criteria: SearchCriteria): Promise<string[]> => {
    // const formData = new FormData();
    // formData.append("image", image);
    // formData.append("strokeCount", strokeCount.toString());
    
    let data;

    const { page, pageSize } = criteria;

    if(criteria.radicals) {
        const radicals = [...criteria.radicals];

        radicals.sort();

        data = {
            radicals,
            page,
            pageSize
        }
    }

    const response = await axios.post<string[]>("/api/characters", data);

    return response.data;
}

export const getRadicals = async (): Promise<string[]> => {
    const result = await axios.get<string[]>("/api/radicals");

    return result.data;
}

export const getCharacter = async (id: string): Promise<Character> => {
    const result = await axios.get<Character>(`/api/character/${id}`);

    return result.data;
}

export const getRandomCharacter = async (languageId: string): Promise<string> => {
    const result = await axios.get<string>("/api/random");

    return result.data;
}
