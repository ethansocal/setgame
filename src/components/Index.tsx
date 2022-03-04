import Card from "./Card";
import Completed from "./Completed";
import React, { Component } from "react";
import Navbar from "./Navbar";
import { Backdrop } from "@mui/material";
import CompletedModal from "./CompletedModal";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import LoadingScreen from "./LoadingScreen";
import AdminView from "./AdminView";

interface State {
    selected: number[];
    found: number[][];
    notification: string;
    win: boolean;
    time: number;
    cards: number[];
    winTime: number;
    loading: boolean;
}

class Index extends Component<null, State> {
    socket: Socket | undefined = undefined;
    constructor(props: null) {
        super(props);
        this.state = {
            selected: [] as number[],
            found: [] as number[][],
            notification: "",
            win: false,
            time: 0,
            cards: Array(12).fill(0) as number[],
            winTime: 0,
            loading: true,
        };
        this.socket = io({ transports: ["websocket"] });

        this.socket.on("game", (puzzle: number[], time: number) => {
            this.setState({ cards: puzzle, time: time, loading: false });
        });

        this.socket.on("setResult", (result: boolean) => {
            if (result) {
                this.setState({
                    found: this.state.found.concat([
                        this.state.selected.sort(),
                    ]),
                });
                this.sendNotification("Congrats! You found a set.");
            } else {
                this.sendNotification("Sorry, you didn't find a set.");
            }
            setTimeout(
                () =>
                    this.setState({
                        selected: [],
                    }),
                300
            );
        });
        this.socket.on("win", (time: number) => {
            this.setState({
                found: this.state.found.concat([this.state.selected]),
                selected: [],
                win: true,
                winTime: time,
            });
        });
    }

    sendNotification(message: string) {
        this.setState({ notification: message });
        setTimeout(() => {
            this.setState((prevState) => {
                return {
                    notification:
                        prevState.notification === message
                            ? ""
                            : prevState.notification,
                };
            });
        }, 3000);
    }

    newGame() {
        this.socket.emit("newGame");
        this.setState({
            loading: true,
            found: [],
            selected: [],
            win: false,
            time: 0,
            cards: Array(12).fill(0) as number[],
            winTime: 0,
        });
    }

    componentDidUpdate(_prevProps: null, prevState: Readonly<State>): void {
        if (prevState.loading !== this.state.loading) {
            document.body.style.overflow = this.state.loading
                ? "hidden"
                : "auto";
        }
    }

    render() {
        return (
            <div className={"" + this.state.loading ? " overflow-hidden" : ""}>
                <Navbar
                    newGame={this.newGame.bind(this)}
                    time={this.state.time}
                    timerRunning={!this.state.win}
                />
                <div
                    className={
                        "rounded-lg border border-green-800 p-3 backdrop-blur-sm fixed top-10 left-2 right-2 bg-green-500/75 motion-safe:transition-all duration-1000 z-10" +
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
                                selected={this.state.selected.includes(index)}
                                onClick={() => {
                                    this.setState((prevState) => {
                                        if (
                                            !prevState.selected.includes(index)
                                        ) {
                                            this.socket.emit("selected", index);
                                            return {
                                                selected:
                                                    prevState.selected.concat(
                                                        index
                                                    ),
                                            };
                                        } else {
                                            this.socket.emit(
                                                "selected",
                                                index * -1 - 1
                                            );
                                            return {
                                                selected:
                                                    prevState.selected.filter(
                                                        (i) => i !== index
                                                    ),
                                            };
                                        }
                                    });
                                }}
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
                <AdminView
                    win={() =>
                        this.setState({ win: true, winTime: Date.now() })
                    }
                    found={this.state.found}
                    cards={this.state.cards}
                    load={() => this.setState({ loading: true })}
                    socket={this.socket}
                />
                <Backdrop
                    open={this.state.win}
                    onClick={this.newGame.bind(this)}
                >
                    <CompletedModal
                        time={this.state.winTime}
                        show={this.state.win}
                        newGame={this.newGame.bind(this)}
                    />
                </Backdrop>
                <LoadingScreen active={this.state.loading} />
            </div>
        );
    }
}

export default Index;
