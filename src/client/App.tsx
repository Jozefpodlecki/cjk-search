import React, { FunctionComponent } from "react";
import styles from "./app.scss";
import { Route, Switch } from "react-router-dom";
import DrawFinder from "components/DrawFinder";
import MultiCornerFinder from "components/MultiCornerFinder";
import RadicalsFinder from "components/RadicalsFinder";
import TopNav from "components/TopNav";
import CharacterInfo from "components/CharacterInfo";

const App: FunctionComponent = () => {

    return <div className={styles.container}>
        <TopNav/>
        <Switch>
            <Route exact path="/" component={DrawFinder} />
            <Route exact path="/character/:id" component={CharacterInfo} />
            <Route exact path="/find-by-four-corner" component={MultiCornerFinder} />
            <Route exact path="/find-by-radicals" component={RadicalsFinder} />
        </Switch>
    </div>
}

export default App;