import Game from "./components/Game";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { io } from "socket.io-client";

const socket = io("/game", { transports: ["websocket"] });

export default function App() {
    const [selected, setSelected] = useState<number[]>([]);
    const [foundSets, setFoundSets] = useState<number[][]>([]);
    const [cards, setCards] = useState<number[]>(Array(12).fill(0));

    useEffect(() => {
        socket.on("connect", () => console.log("Socket connected."));
        socket.on("connect_error", (e) => console.log("Error connecting: ", e));
        socket.on("setPuzzle", (e) => {
            setCards(e);
        });

        return () => {
            socket.off("connect");
            socket.off("connect_error");
            socket.off("setPuzzle");
        };
    }, []);

    useEffect(() => {
        if (selected.length === 3) {
            socket.emit("checkSet", { selected }, (e) => {
                if (e.error) {
                    // TODO: add error message
                } else {
                    if (e.result === true) {
                        setFoundSets((current) => [...current, selected]);
                        setSelected([]);
                    } else {
                        setSelected([]);
                    }
                }
            });
        }
    }, [selected]);

    return (
        <>
            <Navbar
                newGame={() => {
                    socket.emit("newPuzzle");
                }}
                time={0}
                timerRunning={false}
            />
            <div className={"max-w-7xl mx-auto mt-3"}>
                <div className={"px-4"}>
                    <Game
                        cards={cards}
                        selected={selected}
                        setSelected={setSelected}
                        foundSets={foundSets}
                    />
                </div>
            </div>
        </>
    );
}
