import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { charStrokeDictionary, getCharacter } from "api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./characterInfo.scss";

type RouteParam = {
    id: string;
}

type State = {
    isLoading: boolean;
    showStrokeOrder: boolean;
    value: string;
    meanings: string[];
    radicals: {
        value: string;
        pinyin: string;
        meaning: string;
    }[],
}

const CharacterInfo: FunctionComponent = () => {
    const [{
        showStrokeOrder,
        value,
        meanings,
        radicals,
    }, setState] = useState<State>({
        isLoading: true,
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
            <div>
                <div className={styles.iconButton} onClick={onStrokeShow}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                </div>
            </div>
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
            <div>
                {radicals.map(pr => <div className={styles.radical} key={pr.value}>
                    <div className={styles.radicalValue}>{pr.value}</div>
                    <div>{pr.pinyin}</div>
                    <div>{pr.meaning}</div>
                </div>)}
            </div>
            </> : null}
        </div>
    </div>
};

export default CharacterInfo;