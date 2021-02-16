import fs from "fs";
import { promisify } from "util";
import { getFourCornerInfoAsList } from "./api";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const allNumbers = Array(10).fill(0).map((pr, index) => index);

(async () => {
    let list: any[] = [];

    for(const index of allNumbers) {
        const result = await getFourCornerInfoAsList(index);

        list = list.concat(result);
    }

    const content = JSON.stringify(list);

    await writeFile("four_code.json", content);
})();

