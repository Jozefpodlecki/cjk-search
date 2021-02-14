import { getCharacter, getCharacters, getRadicals, getRandomCharacter } from "api";
import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState } from "react";
import { useParams } from "react-router";
import styles from "./characterInfo.scss";

type RouteParam = {
    id: string;
}

type State = {
    isLoading: boolean;
    value: string;
    meanings: string[];
}

const CharacterInfo: FunctionComponent = () => {
    const [{
        isLoading,
        value,
        meanings,
    }, setState] = useState<State>({
        isLoading: true,
        value: "",
        meanings: [],
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

    return <div className={styles.container}>
        <div>
            <div className={styles.text}>{value}</div>
            <div className={styles.list}>
                {meanings.map((pr, index) => <div 
                    className={styles.meaning}
                    key={index}>{pr}</div>)}
            </div>
        </div>
    </div>
};

export default CharacterInfo;