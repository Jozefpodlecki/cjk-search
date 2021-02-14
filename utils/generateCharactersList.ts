import fs from "fs";
import { promisify } from "util";

const getCharList = (start: number, end: number) => {
    const result: any[] = [];

    while(start < end) {
        const value = String.fromCodePoint(start);
        result.push({
            value,
        });
        start++;
    }

    return result;
}

let list = getCharList(0x4E00, 0x9FFF);
list = list.concat(
    getCharList(0x3400, 0x4DBF),
    getCharList(0x20000, 0x2A6DF),
    getCharList(0x2A700, 0x2B73F),
    getCharList(0x2B740, 0x2B81F),
    getCharList(0x2B820, 0x2CEAF));

const content = JSON.stringify(list);
const writeFile = promisify(fs.writeFile);

(async () => {
    await writeFile("characters.json", content);
})();

