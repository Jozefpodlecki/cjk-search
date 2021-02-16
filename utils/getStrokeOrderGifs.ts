
import fs from "fs";
import { promisify } from "util";
import {
    getStrokeOrderGif,
    delay,
    CharacterDetail
} from "./api";
import { join } from "path";

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {

    const fileName = "characters.json";
    const list = JSON.parse(await readFile(fileName, "utf-8")) as CharacterDetail[];
    const start = 3000;
    const end = 9000;
    const slice = list.slice(start, end);
    let index = start; 

    const outputDirectory = "gifs";
    mkdir(outputDirectory);

    for(const char of slice) {
        const text = char.value;
        const encoded = text.charCodeAt(0).toString(16).toLowerCase();
        const filePath = join(outputDirectory, `${encoded}.gif`);
        char.hasStrokeOrder = false;
        index++;

        console.log(`${index} : ${text}`);

        try {
            const statFile = await promisify(fs.stat)(filePath);
            char.hasStrokeOrder = true;
        } catch (error) {
            try {
                await delay(Math.random() * 200 + 50);
                const stream = await getStrokeOrderGif(text);
                char.hasStrokeOrder = true;

                const writer = fs.createWriteStream(filePath);
                stream.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on("error", reject)
                    writer.on("close", resolve)
                });   
            } catch (error) {
                
            }
        }
    }   

    const content = JSON.stringify(list);

    await writeFile(fileName, content);

})();

    