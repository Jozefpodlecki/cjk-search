import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState } from "react";
import styles from "./multiCornerFinder.scss";

const list = [
    {
        id: 0,
        code: "亠",
    },
    {
        id: 1,
        code: "一乚",
    },
    {
        id: 2,
        code: "丨丿亅",
    },
    {
        id: 3,
        code: "丶",
    },
    {
        id: 4,
        code: "十乂",
    },
    {
        id: 5,
        code: "扌",
    },
    {
        id: 6,
        code: "口",
    },
    {
        id: 7,
        code: "﹁「」﹂",
    },
    {
        id: 8,
        code: "八丷人",
    },
    {
        id: 9,
        code: "小忄⺌",
    }
]


type Props = {
    selected?: number;
    disabled: number[];
    index: number;
    onClick(id: number, index: number): void;
}

const MultiCodeSelect: FunctionComponent<Props> = ({
    selected,
    disabled,
    index,
    onClick,
}) => {
    
    const _onClick = (event: MouseEvent<HTMLDivElement>) => 
        onClick(Number(event.currentTarget.dataset.id), index);
    
    return <div className={styles.list}>
        {list.map(({id, code}) => <div key={id}
            data-id={id}
            onClick={_onClick}
            className={`${styles.item}
            ${id === selected ? styles.selected : ""}
            ${disabled && disabled.some(pr => pr === id) ? styles.disabled : ""}
            `}>
                <div className={styles.number}>{id}</div>
                <div>{code}</div>
            </div>)}
    </div>
}

export default MultiCodeSelect;