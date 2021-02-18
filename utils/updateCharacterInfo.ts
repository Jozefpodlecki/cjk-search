require('source-map-support').install()
import fs from "fs";
import { promisify } from "util";
import {
    getCharacterInfoFromChinesepod,
    getCharacterInfoFromKanshudo,
    getFourCornerInfoAsList,
    delay,
    CharacterDetail
} from "./api";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const getCharacters = async () => {
    const fileName = "characters.json";
    return JSON.parse(await readFile(fileName, "utf-8")) as CharacterDetail[];
}

const saveCharacters = async (list: CharacterDetail[]) => {
    const fileName = "characters.json";
    const content = JSON.stringify(list);
    await writeFile(fileName, content);
}

const getFourCornerInfo = async () => {
    const fileName = "four_corner.json";
    return JSON.parse(await readFile(fileName, "utf-8")) as {
        value: string;
        fourCorner: string;
    }[];
}

(async () => {
    const list = await getCharacters();
    const fourCornerList = await getFourCornerInfo();
    
    let index = 0;
    const start = 2351;
    const limit = 3000;

    for(const record of list) {

        if(index < start) {
            console.log(`Skipping ${index} : ${record.value}`);
            index++;
            continue;
        }

        const fourCornerInfo = fourCornerList.find(pr => pr.value === record.value) || {
            fourCorner: undefined,
            meanings: undefined,
        };

        // if(fourCornerInfo.fourCorner) {
        //     console.log(`four corner info found for ${record.value}`)
        // }

        // if(record.checked) {
        //     console.log(`Skipping ${record.value}`)
        //     continue;
        // }

        console.log(`Updating ${index} : ${record.value}`);

        await delay(Math.random() * 100 + 50);
        
        const kanshudoCharInfo = await getCharacterInfoFromKanshudo(record.value);
        
        const chinesepodCharInfo = await getCharacterInfoFromChinesepod(record.value);
        record.fourCorner = fourCornerInfo.fourCorner;
        record.meanings = chinesepodCharInfo.meanings;
        record.radicals = chinesepodCharInfo.radicals;
        record.strokeCount = kanshudoCharInfo.strokeCount;
        record.pinyin = chinesepodCharInfo.pinyin;
        record.checked = true;

        index++;

        if(index % 21 === 0) {
            console.log(`Saving characters...`);
            saveCharacters(list);
        }

        if(index > limit) {
            break;
        }
    }

    saveCharacters(list);

})();
