
import wasmFile from "../../hanzi_lookup_bg.wasm";
import Worker from "../../worker.js";

let handle: ((value: any) => void) | null = null;

const worker = new Worker();
worker.onmessage = onWorkerMessage;
worker.postMessage({ wasm_uri: wasmFile });

type Item = {
    hanzi: string;
    score: number;
}

type Result = {
    item?: string;
    items: Item[];
}

export const getHLCharacters = (strokes: any, limit: number) => new Promise<Result>((resolve, reject) => {
    worker.postMessage({ strokes, limit });

    handle = resolve;
});

function onWorkerMessage({data}: MessageEvent) {
        
    if (!data.what) {
        return;
    }

    if (data.what == "loaded") {
        return;
    }

    if(handle) {
        const items = data.matches;

        handle({
            item: items[0]?.hanzi,
            items,
        });
        handle = null;
    }
}