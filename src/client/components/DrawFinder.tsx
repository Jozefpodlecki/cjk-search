import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState, memo } from "react";
import { faDownload, faPencilAlt, faTimes, faUndo, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./drawFinder.scss";
import { downloadURI } from "utils";
import { Position } from "models/Position";
import { getCharacters } from "api";
import { useTransition, animated } from "react-spring";
import { getHLCharacters } from "api/hanziLookup";

const drawLines = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number) => {
    context.strokeStyle = "grey";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width,  height);
    context.lineTo(0, height);
    context.lineTo(0, 0);
    context.stroke();
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width,  height);
    context.stroke();
    context.beginPath();
    context.moveTo(width, 0);
    context.lineTo(0,  height);
    context.stroke();
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2,  height);
    context.stroke();
    context.beginPath();
    context.moveTo(0,  height / 2);
    context.lineTo(width,  height / 2);
    context.stroke();
    context.strokeStyle = "black";
    context.lineWidth = 5;
}

type State = {
    isDrawing: boolean;
    strokeCount: number;
    strokes: Position[][];
    stroke: Position[];
    result?: string;
    results: string[];
    timestamp: number;
}

const DrawFinder: FunctionComponent = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const [{
        isDrawing,
        strokeCount,
        stroke,
        strokes,
        result,
        results,
        timestamp,
    }, setState] = useState<State>({
        isDrawing: false,
        strokeCount: 0,
        strokes: [],
        stroke: [],
        result: "",
        results: [],
        timestamp: -1,
    });

    useEffect(() => {
        const canvas = canvasRef.current;

        if(!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if(!context) {
            return;
        }

        contextRef.current = context;
        const { width, height } = canvas;
        drawLines(context, width, height);

    }, [])

    useEffect(() => {

        if(isDrawing || !canvasRef.current || !strokes.length) {
            return
        }

        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();

        const _strokes = strokes.map(pr => pr.map(({x,y}) => [x,y]));

        getHLCharacters(_strokes, 20)
            .then(({items, item}) => {
                setState(state=> ({
                    ...state,
                    result: item,
                    results: items.map(pr => pr.hanzi),
                }));
            })

        // getCharacters({
        //     image: dataUrl,
        //     strokes,
        //     strokeCount,
        //     page: 0,
        //     pageSize: 10,
        // }).then(pr => {
        //     setState(state=> ({
        //         ...state,
        //         results: pr,
        //     }));
        // })

    }, [isDrawing, strokes, strokeCount]);

    const getPosition = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const { left, top } = canvasRef.current!.getBoundingClientRect();

        const position = {
            x: clientX - left,
            y: clientY - top,
        };

        return position;
    }

    const onMouseUp = (event: MouseEvent) => {

        if(!isDrawing) {
            return;
        }      

        const position = getPosition(event);
        const _stroke = [...stroke, position];
        const _strokes = [...strokes, _stroke];
        setState(state=> ({
            ...state,
            stroke: [],
            strokes: _strokes,
            isDrawing: false,
            strokeCount: strokeCount + 1,
        }));

        const context = contextRef.current!;
        context.fillRect(position.x, position.y, 1, 1);
    }

    const onMouseMove = (event: MouseEvent) => {
        const threshold = 30;

        if(!isDrawing) {
            return;
        }

        if (new Date().getTime() - timestamp < threshold) {
            return;
        }

        const _timestamp = new Date().getTime();

        const position = getPosition(event);
        const lastStroke = stroke[stroke.length -1];

        if(lastStroke.x === position.x
            && lastStroke.y === position.y) {
                return;
            }

        
        const _stroke = [...stroke, position];
        setState(state=> ({
            ...state,
            timestamp: _timestamp,
            stroke: _stroke
        }));

        const context = contextRef.current!;
        // context.fillRect(position.x, position.y, 5, 5);

        context.lineTo(position.x, position.y)
        context.stroke();
    }

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    }

    const onMouseDown = (event: MouseEvent) => {

        if(event.button !== 0) {
            event.preventDefault();
            return;
        }

        const position = getPosition(event);
        const _stroke = [...stroke, position];
        setState(state=> ({
            ...state,
            stroke: _stroke,
            isDrawing: true,
            timestamp: new Date().getTime(),
        }));

        const context = contextRef.current!;
        context.lineWidth = 5.0;
        context.beginPath();
        context.moveTo(position.x, position.y);
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current!;
        const context = contextRef.current!;
        const { width, height } = canvas;
        context.clearRect(0, 0, width, height);

        drawLines(context, width, height);
    }

    const onRemove = (event: MouseEvent) => {
        setState(state=> ({
            ...state,
            stroke: [],
            strokes: [],
            result: "",
            results: [],
            strokeCount: 0,
        }));

        clearCanvas();
    }

    const onUndo = (event: MouseEvent) => {
        const context = contextRef.current!;
        clearCanvas();
        
        const _strokes = [...strokes];
        _strokes.pop();

        for(const stroke of _strokes) {
            
            const [first, ...steps] = stroke;
            context.beginPath();
            context.moveTo(first.x, first.y);

            for(const step of steps) { 
                context.lineTo(step.x, step.y);
            }

            context.stroke();
        }

        setState(state=> ({
            ...state,
            strokes: _strokes,
            strokeCount: strokeCount - 1,
            result: "",
            results: [],
        }));
    }

    const onDownload = (event: MouseEvent) => {
        const canvas = canvasRef.current!;

        const dataUri = canvas.toDataURL("image/png");
        
        downloadURI(dataUri, "image.png");
    }

    return <div className={styles.container}>
        <div className={styles.canvasWrapper}>
            <canvas width="300" height="300"
                onContextMenu={onContextMenu}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className={styles.canvas} ref={canvasRef}/>
            <div className={styles.actions}>
            {strokeCount ? 
            <>
                <div className={styles.icon} onClick={onRemove}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
                <div className={styles.icon} onClick={onUndo}>
                    <FontAwesomeIcon icon={faUndo}/>
                </div>
                <div className={styles.icon} onClick={onDownload}>
                    <FontAwesomeIcon icon={faDownload}/>
                </div>
            </> : null}
            </div>
        </div>
       
        <div className={styles.result}>
            {results.length ? <>
                <a  href={`/character/${result}`} className={styles.bestMatch}>{result}</a>
                <div className={styles.results}>
                    {results.map(pr => <animated.a
                        className={styles.item}
                        href={`/character/${pr}`}
                        key={pr}>
                        {pr}
                    </animated.a>)}
                </div>
            </> : null}
        </div>
    </div>;
}

export default memo(DrawFinder);