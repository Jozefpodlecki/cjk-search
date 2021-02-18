import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { charStrokeDictionary, getCharacter } from "api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./characterInfo.scss";

type RouteParam = {
    id: string;
}

// {
//     value: string;
//     pinyin: string;
//     meaning: string;
// }[] | 

type State = {
    isLoading: boolean;
    showStrokeOrder: boolean;
    hasStrokeOrder: boolean;
    value: string;
    meanings: string[];
    radicals: string[];
}

const CharacterInfo: FunctionComponent = () => {
    const [{
        showStrokeOrder,
        hasStrokeOrder,
        value,
        meanings,
        radicals,
    }, setState] = useState<State>({
        isLoading: true,
        hasStrokeOrder: false,
        showStrokeOrder: false,
        value: "",
        meanings: [],
        radicals: [],
    });
    const { id } = useParams<RouteParam>();

    useEffect(() => {
        getCharacter(id)
            .then(character => {
                setState(state => ({
                    ...state,
                    ...character,
                    isLoading: false,
                }));
            });
    }, [id]);

    const onStrokeShow = () => {
        setState(state => ({
            ...state,
            showStrokeOrder: !state.showStrokeOrder,
        }));
    }

    const mappedFile = `./${value.charCodeAt(0).toString(16)}.gif`;
    const imageSrc = charStrokeDictionary[mappedFile];

    return <div className={styles.container}>
        <div>
            {showStrokeOrder ? <div className={styles.imageWrapper}>
                    <img className={styles.image} src={imageSrc}/>
                </div> : <div>
                    <div className={styles.text}>{value}</div>
                </div>}
            <div className={styles.topPanel}>
                {hasStrokeOrder ? <div className={styles.iconButton} onClick={onStrokeShow}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                </div> : null}
            </div>
        </div>
        <div className={styles.details}>
            {meanings.length ? <>
                <div className={styles.header}>Meanings</div>
                <div className={styles.list}>
                    {meanings.map((pr, index) => <div 
                        className={styles.meaning}
                        key={index}>{pr}</div>)}
                </div>
            </> : null}
            {radicals.length ? <>
            <div className={styles.header}>Radicals</div>
            <div className={styles.radicalsList}>
                {radicals.map(pr => <div className={styles.radical} key={pr}>{pr}</div>)}
            </div>
            </> : null}
        </div>
    </div>
};

export default CharacterInfo;