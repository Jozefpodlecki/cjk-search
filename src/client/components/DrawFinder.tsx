import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState, memo } from "react";
import { faDownload, faPencilAlt, faTimes, faUndo, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./drawFinder.scss";
import { downloadURI } from "utils";
import { Position } from "models/Position";

type State = {
    isDrawing: boolean;
    strokeCount: number;
    strokes: Position[][];
    stroke: Position[];
}

const DrawFinder: FunctionComponent = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const [{
        isDrawing,
        strokeCount,
        stroke,
        strokes,
    }, setState] = useState<State>({
        isDrawing: false,
        strokeCount: 0,
        strokes: [],
        stroke: [],
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

    }, [strokeCount])

    const getPosition = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const { left, top } = canvasRef.current!.getBoundingClientRect();

        return {
            x: clientX - left,
            y: clientY - top,
        };
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

        if(!isDrawing) {
            return;
        }

        const position = getPosition(event);
        const _stroke = [...stroke, position];
        setState(state=> ({
            ...state,
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
        }));

        const context = contextRef.current!;
        //context.fillRect(position.x, position.y, 1, 1);
        context.lineWidth = 5.0;
        context.beginPath();
        context.moveTo(position.x, position.y);
    }

    const onRemove = (event: MouseEvent) => {
        setState(state=> ({
            ...state,
            stroke: [],
            strokes: [],
            strokeCount: 0,
        }));
    }

    const onUndo = (event: MouseEvent) => {
        const canvas = canvasRef.current!;
        const context = contextRef.current!;
        context.clearRect(0, 0, canvas.width, canvas.height);
        
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
        }));
    }

  

    const onDownload = (event: MouseEvent) => {
        const canvas = canvasRef.current!;

        const dataUri = canvas.toDataURL("image/png");
        
        downloadURI(dataUri, "image.png");
    }

    return <div>
         <canvas width="500" height="500"
            onContextMenu={onContextMenu}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={styles.canvas} ref={canvasRef}/>
        {strokeCount ? <div className={styles.actions}>
            <div className={styles.icon} onClick={onRemove}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
            <div className={styles.icon} onClick={onUndo}>
                <FontAwesomeIcon icon={faUndo}/>
            </div>
            <div className={styles.icon} onClick={onDownload}>
                <FontAwesomeIcon icon={faDownload}/>
            </div>
        </div> : null}
     
    </div>;
}

export default memo(DrawFinder);