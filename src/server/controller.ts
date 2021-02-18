import { JsonController, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import _characters from "./characters.json";
import _radicals_hanzi_map from "./radicals_hanzi_map.json";
import _radicals from "./radicals.json";
import _four_corner from "./four_corner.json";
import { Position } from "../client/models/Position";

type SearchCriteria = {
    radicals?: string[];
    strokes?: Position[][];
    strokeCount?: number;
    image?: string;
    fourCorner?: Record<number, number>;
    page: number;
    pageSize: number;
}
@JsonController()
export class Controller {
    @Get("/api/random")
    getRandomCharacter() {
        const length = _characters.length;

        const index = Math.floor(Math.random() * length);
        const character = _characters[index];
        
        return character.value;
    }

    @Get("/api/character/:id")
    getCharacter(@Param('id') id: string) {
        const character = _characters.find(pr => pr.value === id);

        return character;
    }

    @Get("/api/radicals")
    getRadicals() {
        return _radicals;
    }

    

    @Post("/api/characters")
    getCharactersByRadicals(@Body() criteria: SearchCriteria) {
        if(criteria.radicals) {
            const { radicals, page, pageSize } = criteria;

            const radicals_hanzi_map = _radicals_hanzi_map as unknown as Record<string,string>;
            let intersection: string[] = [];

            for(const radical of radicals) {
                const characters = radicals_hanzi_map[radical];
                intersection = intersection.concat(characters);
            }

            const map = intersection.reduce((acc, value) => {
                acc[value] = acc[value] || 0;
                acc[value]++;
                return acc;
            }, {} as Record<string, number>);

            let characters = Object.entries(map)
                .filter(([, value]) => value === radicals.length)
                .map(([key, ]) => key);

            const offset = page * pageSize;
            characters = characters.slice(offset, pageSize);
            
            return characters;
        }

        if(criteria.strokes) {

            return [];
        }

        if(criteria.image) {

            return [];
        }

        if(criteria.strokeCount) {

            const characters = _characters
                .filter(pr => pr.strokeCount === criteria.strokeCount);

            return characters;
        }

        if(criteria.fourCorner) {

            criteria.fourCorner


            const result = _four_corner
                .filter(pr => pr.fourCorner)

            //const characters = _characters.filter(pr => pr.fourCorner && pr.fourCorner.includes(criteria.fourCorner));

            return result;
        }
  
    }
}