require('source-map-support').install()
import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";
import { promisify } from "util";

type CharacterDetail = {
    value: string;
    fourCorner?: string;
    meanings?: string[];
    pinyin?: string;
    checked?: boolean;
}

const fileName = "characters.json";

const delay = (timeout: number) => new Promise((resolve,) => setTimeout(resolve, timeout));
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const headers = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
};

const getCharacterInfo = async (char: string) => {
    const encoded = encodeURI(char);
    const response = await axios.get(`https://www.chinesepod.com/dictionary/${encoded}`, {
        headers
    });

    const $ = cheerio.load(response.data);

    const elements = Array.from($(".definition ol li"));
    const cardElement = $(".definition")[0] as any;
    let pinyin = undefined;

    if(cardElement) {
        pinyin = cardElement.firstChild.lastChild.lastChild.data;
    }

    const meanings = [];

    for(const element of elements) {
        const item = (element.firstChild as any).data;
        meanings.push(item);
    }

    return {
        pinyin,
        meanings,
    }
};

const getFourCornerInfo = async (num: number) => {
    const response = await axios.get(`https://en.wiktionary.org/wiki/Index:Chinese_four_corner/${num}`, {
        headers
    });

    const $ = cheerio.load(response.data);

    const elements = Array.from($("ul li"));
    const list = [];

    for(const element of elements) {
        const firstChild = element.firstChild as any;
        const lastChild = element.lastChild as any;

        if(firstChild.name !== "b"
            && lastChild.name !== "span") {
                continue;
        }

        let fourCorner = firstChild.firstChild.data as any;
        const subElement = firstChild.lastChild as any;

        if(subElement.type !== "text") {
            fourCorner += subElement.firstChild.data;
        }

        const characters = lastChild.children;
        
        for(const charElement of characters) {

            if(!charElement.firstChild) {
                continue;
            }

            const value = charElement.firstChild.data;
            const item = {
                value,
                fourCorner,
            };

            list.push(item);
        }
    }

    return list;
}    

(async () => {
    const list = JSON.parse(await readFile(fileName, "utf-8")) as CharacterDetail[];

    const details = await getFourCornerInfo(0) as {
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
