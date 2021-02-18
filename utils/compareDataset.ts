require('source-map-support').install()
import fs from "fs";
import { promisify } from "util";
import {
    getCharacterInfoFromChinesepod,
    getCharacterInfoFromKanshudo,
    getFourCornerInfoAsList,
    delay,
    CharacterDetail,
    getCharacterInfoFromWikipedia
} from "./api";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const loadFile = async (fileName: string) => {
    return JSON.parse(await readFile(fileName, "utf-8"));
}

(async () => {
    const source = await loadFile("radicals1.json");
    const destination = await loadFile("radicals.json");
    let count = 0;
    const list: any[] = []

    for(const record of destination) {

        list.push({
            value: record.radical,
            meaning: record.meaning,
            pinyin_yale: record.pinyin_yale_romanized,
            stroke_count: record.stroke_count,
            variant: record.variant,
            audio_src: record.audio_src,
        })   
    }

    for(const record of source) {
        const match = destination.find((pr: any) => pr.radical === record);

        if(!match) {

            const info = await getCharacterInfoFromWikipedia(record);

            list.push({
                value: record,
            })
        }
    }

    await writeFile("combined_radicals.json", list);
})();
