import React, { useState } from "react";
import CofetarieList from "./views/CofetarieList";
import PrajituraList from "./views/PrajituraList";

function App() {
    const [view, setView] = useState("cofetarii");

    return (
        <div className="App">
            <h1>Administrație Cofetărie</h1>
            <button onClick={() => setView("cofetarii")}>Cofetării</button>
            <button onClick={() => setView("prajituri")}>Prăjituri</button>

            <hr />

            {view === "cofetarii" ? <CofetarieList /> : <PrajituraList />}
        </div>
    );
}

export default App;
