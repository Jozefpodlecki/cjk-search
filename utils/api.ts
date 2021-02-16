import axios from "axios";
import cheerio from "cheerio";
import { Stream } from "stream";

const headers = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
};

export const getCharacterInfo = async (char: string) => {
    const encoded = encodeURI(char);
    const response = await axios.get(`https://www.chinesepod.com/dictionary/${encoded}`, {
        headers
    });

    const $ = cheerio.load(response.data);

    const meaningElements = Array.from($(".definition ol li")) as any[];
    const cardElement = $(".definition")[0] as any;
    const radicalElements = Array.from($(".decomposition-item a")) as any[];
    const meanings = [];
    const radicals = [];
    let pinyin = undefined;

    if(cardElement) {
        pinyin = cardElement.firstChild.lastChild.lastChild.data;
    }

    for(const radicalElement of radicalElements) {
        const item = radicalElement.firstChild.data;
        radicals.push(item);
    }

    for(const meaningElement of meaningElements) {
        const item = meaningElement.firstChild.data;
        meanings.push(item);
    }

    return {
        pinyin,
        meanings,
        radicals,
    }
};

export const getFourCornerInfoAsDict = async (num: number) => {
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

export const getFourCornerInfoAsList = async (num: number) => {
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

export const getStrokeOrderGif = async (char: string) => {
    const encoded = encodeURI(encodeURI(char));
    const url = `https://dictionary.writtenchinese.com/giffile.action?&localfile=true&fileName=${encoded}.gif`;
    const response = await axios.get<Stream>(url, {
        headers,
        responseType: "stream"
    });

    return response.data;
}

export const delay = (timeout: number) => new Promise((resolve,) => setTimeout(resolve, timeout));

export type CharacterDetail = {
    value: string;
    fourCorner?: string;
    meanings?: string[];
    pinyin?: string;
    checked?: boolean;
    hasStrokeOrder?: boolean;
}