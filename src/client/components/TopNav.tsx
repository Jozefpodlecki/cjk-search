import React, { FunctionComponent, memo } from "react";
import { faDice, faPencilAlt, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { NavLink, useHistory } from "react-router-dom";
import styles from "./topNav.scss";
import { getRandomCharacter } from "api";

const TopNav: FunctionComponent = () => {
    const history = useHistory();
    const github = "https://github.com/Jozefpodlecki/cjk-search"

    const onRandomClick = () => {
        getRandomCharacter("zh")
            .then(char => {
                history.push(`/character/${char}`);
            })
    }

    return <div className={styles.navbar}>
         <div onClick={onRandomClick} className={styles.navItem}>
            <FontAwesomeIcon icon={faDice}/>
            <div className={styles.navItemText}>Random</div>
        </div>
        <NavLink exact to="/" className={styles.navItem}
            activeClassName={styles.selected}>
            <FontAwesomeIcon icon={faPencilAlt}/>
            <div className={styles.navItemText}>Draw</div>
        </NavLink>
        <NavLink exact to="/find-by-four-corner" className={styles.navItem}
            activeClassName={styles.selected}>
            <FontAwesomeIcon icon={faVectorSquare}/>
            <div className={styles.navItemText}>Four corner</div>
        </NavLink>
        <NavLink exact to="/find-by-radicals" className={styles.navItem}
            activeClassName={styles.selected}>
            <FontAwesomeIcon icon={faVectorSquare}/>
            <div className={styles.navItemText}>Radicals</div>
        </NavLink>
        <a href={github} className={`${styles.navItem} ${styles.github}`}>
            <FontAwesomeIcon icon={faGithub}/>
        </a>
    </div>;
}

export default memo(TopNav);