import { getCharacters } from "api";
import React, { FunctionComponent, useEffect, useState } from "react";
import MultiCodeSelect from "./MultiCodeSelect";
import styles from "./multiCornerFinder.scss";

const allNumbers = Array(10).fill(0).map((pr, index) => index);

type State = {
    selected: Record<number, number>;
    disabled: Record<number, number[]>;
    characters: string[];
}

const MultiCornerFinder: FunctionComponent = () => {
    const [{
        selected,
        disabled,
        characters,
    }, setState] = useState<State>({
        selected: {},
        disabled: {},
        characters: [],
    });

    useEffect(() => {

        if(Object.values(selected).some(pr => pr !== -1)) {

            getCharacters({
                page: 0,
                pageSize: 10,
                fourCode: selected,
            })
        }

    }, [selected]);

    const onClick = (id: number, index: number) => {
        
        if(selected[index] === id) {
            setState(state => ({
                ...state,
                selected: {
                    ...state.selected,
                    [index]: -1,
                },
                disabled: {
                    ...state.disabled,
                    [index]: []
                }
            }))
            return;
        }


        setState(state => ({
            ...state,
            selected: {
                ...state.selected,
                [index]: id,
            },
            disabled: {
                ...state.disabled,
                [index]: allNumbers.filter(pr => pr !== id)
            }
        }))   
    }
 
    return <div className={styles.multiCornerFinder}>
        <div className={styles.grid}>
            <MultiCodeSelect
                index={0}
                selected={selected[0]}
                disabled={disabled[0]}
                onClick={onClick}/>
            <div className={styles.verticalBeam}></div>
            <MultiCodeSelect
                index={1}
                selected={selected[1]}
                disabled={disabled[1]}
                onClick={onClick}/>
            <div className={styles.horizontalBeam}></div>
            <MultiCodeSelect
                index={2}
                selected={selected[2]}
                disabled={disabled[2]}
                onClick={onClick}/>
            <div className={styles.verticalBeam}></div>
            <MultiCodeSelect
                index={3}
                selected={selected[3]}
                disabled={disabled[3]}
                onClick={onClick}/>
            <MultiCodeSelect
                index={4}
                selected={selected[4]}
                disabled={disabled[4]}
                onClick={onClick}/>
        </div>
       <div>
           {<div></div>}
       </div>
    </div>
}

export default MultiCornerFinder;