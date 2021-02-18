import { faArrowLeft, faArrowRight, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCharacters, getRadicals } from "api";
import React, { FunctionComponent, useEffect, useRef, MouseEvent, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import Radical from "./Radical";
import styles from "./radicalsFinder.scss";

type State = {
    selected: string[];
    radicals: string[];
    characters: string[];
    page: number;
}

const pageSize = 48;

const RadicalsFinder: FunctionComponent = () => {
    const [{
        selected,
        radicals,
        characters,
        page,
    }, setState] = useState<State>({
        selected: [],
        radicals: [],
        characters: [],
        page: 0,
    });
    const transitions = useTransition(characters, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: () => async (next: any) => {
            await next({opacity: 0});
            await next({display: "none"});
        },
        trail: 10
    })

    useEffect(() => {

        getRadicals()
            .then(radicals => {
                setState(state => ({
                    ...state,
                    radicals,
                }))
            })
    }, []);

    useEffect(() => {
        if(selected.length) {
            getCharacters({
                radicals: selected,
                page,
                pageSize,
            }).then(characters => {
                setState(state => ({
                    ...state,
                    characters,
                }))
            })
        }
        else {
            setState(state => ({
                ...state,
                characters: [],
            }))
        }

    }, [page, selected]);

    const onClick = (id: string) => {

        setState(state => {
            const index = state.selected.findIndex(pr => pr === id);
            let selected;

            if(index !== -1) {
                selected = state.selected.filter(pr => pr !== id);
            }
            else {
                selected = [...state.selected, id];
            }

            return {
                ...state,
                selected
            };
        });
    }

    const onChange = (event: ChangeEvent) => {

    }

    const onFilter = () => {

    }

    const onPrevPage = () => {
        setState(state => ({
            ...state,
            page: state.page - 1,
        }))
    }

    const onNextPage = () => {
        setState(state => ({
            ...state,
            page: state.page + 1,
        }))
    }

    return <div className={styles.radicalsFinder}>
        <div className={styles.radicalsPanel}>
            <div className={styles.searchPanel}>
                <input
                    type="text"
                    placeholder="Search by pinyin and meaning..."
                    className={styles.input}
                    onChange={onChange}/>
                <div className={styles.filterButton}>
                    <FontAwesomeIcon icon={faFilter}/>
                </div>
            </div>
            <div  className={styles.list}>
                {radicals.map(value => <Radical
                    key={value}
                    value={value}
                    isSelected={selected.includes(value)}
                    onClick={onClick}/>)}
            </div>
        </div>
        <div className={styles.charactersPanel}>
            <div className={styles.searchPanel}>
                <input
                    type="text"
                    placeholder="Search by pinyin..."
                    className={styles.input}
                    onChange={onChange}/>
                <div onClick={onFilter} className={styles.filterButton}>
                    <FontAwesomeIcon icon={faFilter}/>
                </div>
            </div>
            <div className={styles.characters}>
                {characters.map(item => <animated.a
                    key={item}
                    className={styles.character}
                    href={`/character/${item}`}
                    data-id={item}>{item}</animated.a>)}
            </div>
            <div className={styles.pagination}>
                <div className={styles.iconButton} onClick={onPrevPage}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </div>
                <div className={styles.iconButton} onClick={onNextPage}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                </div>
            </div>
        </div>
    </div>
}

export default RadicalsFinder;