import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {
    const dictionary = JSON.parse(await readFile("radicals_hanzi_map copy.json", "utf-8"));
    const list = [];

    for(const key of Object.keys(dictionary)) {
        list.push(key);
    }

    const content = JSON.stringify(list);

    await writeFile("radicals.json", content);
})();

