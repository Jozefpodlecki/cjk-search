import { getCharacters } from "api";
import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState } from "react";
import MultiCodeSelect from "./MultiCodeSelect";
import styles from "./multiCornerFinder.scss";

const allNumbers = Array(10).fill(0).map((pr, index) => index);

type State = {
    selected: Record<number, number>;
    disabled: Record<number, number[]>;
}

const MultiCornerFinder: FunctionComponent = () => {
    const [{
        selected,
        disabled,
    }, setState] = useState<State>({
        selected: {},
        disabled: {}
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
        <MultiCodeSelect
            index={0}
            selected={selected[0]}
            disabled={disabled[0]}
            onClick={onClick}/>
        <MultiCodeSelect
            index={1}
            selected={selected[1]}
            disabled={disabled[1]}
            onClick={onClick}/>
        {/* <MultiCodeSelect index=(1) selected={} onClick={onClick}/>
        <MultiCodeSelect index=(2) selected={} onClick={onClick}/>
        <MultiCodeSelect index=(3) selected={} onClick={onClick}/>
        <MultiCodeSelect index=(4) selected={} onClick={onClick}/> */}
    </div>
}

export default MultiCornerFinder;