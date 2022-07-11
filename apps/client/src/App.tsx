import Game from "./components/Game";
import { useState } from "react";

export default function App() {
    const [selected, setSelected] = useState<number[]>([]);
    const [foundSets, setFoundSets] = useState<number[][]>([]);

    return (
        <div className={"max-w-7xl mx-auto px-3"}>
            <Game
                cards={Array(12)
                    .fill(0)
                    .map((_, index) => index + 1)}
                selected={selected}
                setSelected={setSelected}
                foundSets={foundSets}
            />
        </div>
    );
}
