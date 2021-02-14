import fs from "fs";
import { promisify } from "util";
import axios from "axios";
import cheerio from "cheerio";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const headers = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
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

const allNumbers = Array(10).fill(0).map((pr, index) => index);

(async () => {
    let list: any[] = [];

    for(const index of allNumbers) {
        const result = await getFourCornerInfo(index);

        list = list.concat(result);
    }

    const content = JSON.stringify(list);

    await writeFile("four_code.json", content);
})();

