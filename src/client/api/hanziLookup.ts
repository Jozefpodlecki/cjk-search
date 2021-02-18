
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

export const getHLCharacters = (strokes: any, limit: number) => new Promise<Item[]>((resolve, reject) => {
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
        handle(data.matches);
        handle = null;
    }
}