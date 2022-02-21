import Card from "../components/card";
import Completed from "../components/completed";
import { useEffect, useState } from "react";

export default function Index() {
    // States
    const [cards, setCards] = useState(Array(12).fill(0));
    const [selected, setSelected] = useState([] as number[]);
    const [found, setFound] = useState([] as number[][]);
    const [notification, setNotification] = useState("");

    // Effects
    useEffect(() => {
        const tempCards = JSON.parse(
            window.atob(getCookie("token").split(".")[1])
        ).puzzle;
        setCards(tempCards);
        if (localStorage.getItem("found") !== null) {
            const tempFound: number[][] = JSON.parse(
                localStorage.getItem("found")
            );
            const promises = [];
            for (let i = 0; i < tempFound.length; i++) {
                promises.push(
                    fetchJson(
                        "/api/checkSet",
                        tempFound[i].map((i) => tempCards[i])
                    ).then((data) => {
                        return data.result ? tempFound[i] : null;
                    })
                );
            }
            Promise.all(promises).then((data) => {
                data = data.filter((x) => x !== null);
                setFound(removeDuplicateArraysFromArray(data));
            });
        }
    }, []);

    useEffect(() => {
        if (found.length > 0) {
            localStorage.setItem("found", JSON.stringify(found));
        }
    }, [found]);

    // Functions
    async function fetchJson(
        url: string,
        body: Array<any> | Record<string, any>,
        method = "POST"
    ): Promise<any> {
        const res = fetch(url, {
            body: JSON.stringify(body),
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await (await res).json();
    }

    function removeDuplicateArraysFromArray(array: Array<any>): Array<any> {
        const temp = [];
        for (let i = 0; i < array.length; i++) {
            if (!temp.some((x) => x.join("") === array[i].join(""))) {
                temp.push(array[i]);
            }
        }
        return temp;
    }

    function getCookie(cname: string): string {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function sendNotification(message: string) {
        setNotification(message);
        setTimeout(function () {
            console.log(notification + " current");
            if (message === notification || notification === "") {
                setNotification("");
            }
        }, 3000);
    }

    function clickCard(card: number) {
        let newSelected: number[];
        if (selected.includes(card)) {
            newSelected = selected.filter((c) => c !== card).sort();
        } else {
            newSelected = selected.concat(card);
        }
        if (newSelected.length === 3) {
            const actualSelected = newSelected
                .map((i) => {
                    return cards[i];
                })
                .sort();
            fetchJson("/api/checkSet", actualSelected).then((data) => {
                if (data.result) {
                    if (
                        !found.some((f) =>
                            arraysEqual(
                                f.map((x) => cards[x]),
                                actualSelected
                            )
                        )
                    ) {
                        sendNotification("Congrats! You found a set.");
                        setFound(found.concat([newSelected]));
                    } else {
                        sendNotification("Sorry, you already found that set.");
                    }
                } else {
                    sendNotification("Sorry, that's not a set.");
                }
                setSelected(newSelected);
                setTimeout(() => setSelected([]), 300);
            });
        } else {
            setSelected(newSelected);
        }
    }

    function newGame() {
        fetch("/api/newGame", { method: "POST" }).then(() => {
            setCards(
                JSON.parse(window.atob(getCookie("token").split(".")[1])).puzzle
            );
            setSelected([]);
            setFound([]);
        });
    }

    return (
        <>
            <header className="flex m-auto shadow-lg">
                <h1 className="text-center text-[80px] tracking-[0.022em] m-3">
                    Set Game!
                </h1>
                <nav className="text-[40px] underline decoration-current decoration-solid">
                    <h3
                        id="new-game"
                        onClick={newGame}
                        className="cursor-pointer hover:text-cyan-700 dark:hover:text-sky-600"
                    >
                        New Puzzle
                    </h3>
                </nav>
            </header>
            <div
                className={
                    "rounded-lg border border-green-800 p-3 backdrop-blur-sm fixed top-10 left-2 right-2 bg-green-500/75 motion-safe:transition-all duration-1000" +
                    (notification === "" ? " hidden" : "")
                }
            >
                {notification}
            </div>
            <div className="flex m-auto flex-col xl:flex-row gap-3 place-content-center">
                <div
                    className="grid grid-cols-4 grid-rows-3 gap-3 p-3 basis-[7/8]"
                    id="game"
                >
                    {cards.map((card, index) => (
                        <Card
                            card={card}
                            key={index}
                            selected={selected.includes(index)}
                            onClick={() => clickCard(index)}
                        />
                    ))}
                </div>
                <div className="flex flex-col xl:flex-row ">
                    <div className="m-auto h-auto w-auto min-w-[200px] min-h-[300px]">
                        <h1 className="text-center text-xl m-auto">
                            Found Sets
                        </h1>
                        <div
                            id="completed"
                            className="grid grid-cols-3 grid-rows-6 gap-0 grow-0"
                        >
                            {Array(18)
                                .fill(0)
                                .map((_, index) => (
                                    <Completed
                                        key={index}
                                        card={(() => {
                                            try {
                                                return cards[
                                                    found[
                                                        Math.floor(index / 3)
                                                    ][index % 3]
                                                ];
                                            } catch {
                                                return 0;
                                            }
                                        })()}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <form method="POST" action="/win">
                <input type="hidden" id="data" name="data" />
            </form>
        </>
    );
}
