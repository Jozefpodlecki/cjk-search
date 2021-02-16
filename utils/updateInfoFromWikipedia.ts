require('source-map-support').install()
import fs from "fs";
import { promisify } from "util";
import {
    getCharacterInfo,
    getFourCornerInfoAsList,
    delay,
    CharacterDetail
} from "./api";

const fileName = "characters.json";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


(async () => {
    const list = JSON.parse(await readFile(fileName, "utf-8")) as CharacterDetail[];

    const details = await getFourCornerInfoAsList(0) as {
        value: string;
        fourCorner: string;
    }[];
    let index = 0;

    for(const record of list) {

        const fourCornerInfo = details.find(pr => pr.value === record.value) || {
            fourCorner: undefined,
            meanings: undefined,
        };

        if(fourCornerInfo.fourCorner) {
            console.log(`four corner info found for ${record.value}`)
        }

        if(record.checked) {
            console.log(`Skipping ${record.value}`)
            continue;
        }

        console.log(`Updating ${record.value}`);

        await delay(Math.random() * 200 + 200);
        
        const info = await getCharacterInfo(record.value) as {
            meanings: string[];
            pinyin: string;
        };
        record.fourCorner = fourCornerInfo.fourCorner;
        record.meanings = info.meanings;
        record.pinyin = info.pinyin;
        record.checked = true;

        index++;

        if(index > 30) {
            break;
        }
    }

    const content = JSON.stringify(list);

    await writeFile(fileName, content);

})();
