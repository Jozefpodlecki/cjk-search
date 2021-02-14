import React, { FunctionComponent, MouseEvent, memo } from "react";
import styles from "./radicalsFinder.scss";

type Props = {
    value: string;
    isSelected: boolean;
    onClick(value: string): void;
}

const Radical: FunctionComponent<Props> = ({
    value,
    isSelected,
    onClick
}) => {
    const _onClick = (event: MouseEvent<HTMLDivElement>) => 
        onClick(event.currentTarget.dataset.id as string);

    return <div data-id={value}
        onClick={_onClick}
        className={`${styles.radical} ${isSelected ? styles.selected : ""}`}>
        {value}
    </div>
}

export default memo(Radical);