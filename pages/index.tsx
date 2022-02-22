import Card from "../components/Card";
import Completed from "../components/Completed";
import { Component } from "react";
import Navbar from "../components/Navbar";

interface State {
    cards: number[];
    selected: boolean[];
    found: number[][];
    notification: string;
    time: number;
}

export default class Index extends Component<Record<string, unknown>, State> {
    constructor(props) {
        super(props);
        this.state = {
            cards: Array(12).fill(0),
            selected: Array(12).fill(false) as boolean[],
            found: [] as number[][],
            notification: "",
            time: 0,
        };
    }

    componentDidMount() {
        const data = JSON.parse(
            window.atob(Index.getCookie("token").split(".")[1])
        );
        const tempCards = data.puzzle;
        this.setState({ cards: tempCards, time: data.time });
        if (localStorage.getItem("found") !== null) {
            const tempFound: number[][] = JSON.parse(
                localStorage.getItem("found")
            );
            const promises = [];
            for (let i = 0; i < tempFound.length; i++) {
                promises.push(
                    this.fetchJson(
                        "/api/checkSet",
                        tempFound[i].map((i) => tempCards[i])
                    ).then((data) => {
                        return data.result ? tempFound[i] : null;
                    })
                );
            }
            Promise.all(promises).then((data) => {
                data = data.filter((x) => x !== null);
                this.setState({
                    found: Index.removeDuplicateArraysFromArray(data),
                });
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.found !== prevState.found &&
            this.state.found.length > 0
        ) {
            localStorage.setItem("found", JSON.stringify(this.state.found));
        }
        if (
            this.state.notification !== prevState.notification &&
            this.state.notification !== ""
        ) {
            setTimeout(() => {
                if (this.state.notification !== prevState.notification)
                    this.setState({ notification: "" });
                console.log(this.state.notification);
            }, 3000);
        }
        if (prevState.selected !== this.state.selected) {
            const selected = this.state.selected
                .map((x, i) => {
                    if (!x) {
                        return null;
                    } else {
                        return this.state.cards[i];
                    }
                })
                .filter((x) => x !== null)
                .sort();
            if (selected.length === 3) {
                this.fetchJson("/api/checkSet", selected).then((data) => {
                    if (data.result) {
                        if (
                            !this.state.found.some((f) =>
                                Index.arraysEqual(
                                    f.map((x) => this.state.cards[x]),
                                    selected
                                )
                            )
                        ) {
                            this.sendNotification("Congrats! You found a set.");
                            this.setState({
                                found: this.state.found.concat([selected]),
                            });
                        } else {
                            this.sendNotification(
                                "Sorry, you already found that set."
                            );
                        }
                    } else {
                        this.sendNotification("Sorry, that's not a set.");
                    }
                    setTimeout(
                        () =>
                            this.setState({ selected: Array(12).fill(false) }),
                        300
                    );
                });
            }
        }
    }

    // Functions
    async fetchJson(
        url: string,
        body: unknown[] | { [key: string]: unknown },
        method = "POST"
    ): Promise<{ [key: string]: unknown }> {
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

    static removeDuplicateArraysFromArray<A>(array: A[]): A[] {
        const temp = [];
        for (let i = 0; i < array.length; i++) {
            if (!temp.some((x) => this.arraysEqual(x, array[i]))) {
                temp.push(array[i]);
            }
        }
        return temp;
    }

    static getCookie(cname: string): string {
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
    static arraysEqual(a, b) {
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

    sendNotification(message: string) {
        this.setState({ notification: message });
    }

    newGame() {
        fetch("/api/newGame", { method: "POST" }).then(() => {
            const data = JSON.parse(
                window.atob(Index.getCookie("token").split(".")[1])
            );
            this.setState({
                cards: data.puzzle,
                selected: Array(12).fill(false),
                found: [],
                notification: "",
                time: data.time,
            });
        });
    }

    render() {
        return (
            <>
                <Navbar
                    newGame={this.newGame.bind(this)}
                    time={this.state.time}
                />
                <div
                    className={
                        "rounded-lg border border-green-800 p-3 backdrop-blur-sm fixed top-10 left-2 right-2 bg-green-500/75 motion-safe:transition-all duration-1000" +
                        (this.state.notification === "" ? " hidden" : "")
                    }
                >
                    {this.state.notification}
                </div>
                <div className="flex m-auto flex-col xl:flex-row gap-3 place-content-center">
                    <div
                        className="grid grid-cols-4 grid-rows-3 gap-3 p-3 basis-[7/8]"
                        id="game"
                    >
                        {this.state.cards.map((card, index) => (
                            <Card
                                card={card}
                                key={index}
                                selected={this.state.selected[index]}
                                onClick={() =>
                                    this.setState({
                                        selected: this.state.selected.map(
                                            (x, i) => {
                                                if (index === i) {
                                                    return !x;
                                                } else {
                                                    return x;
                                                }
                                            }
                                        ),
                                    })
                                }
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
                                                    return this.state.cards[
                                                        this.state.found[
                                                            Math.floor(
                                                                index / 3
                                                            )
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
            </>
        );
    }
}
