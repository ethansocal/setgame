import { Component } from "react";

interface Props {
    time: number;
    show: boolean;
    newGame: () => void;
}

interface State {
    update: boolean;
}

export default class CompletedModal extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    formatTime(time: number): string {
        const hours = Math.floor(time / 1000 / 60 / 60);
        const minutes = Math.floor(time / 1000 / 60) % 60;
        const seconds = Math.floor(time / 1000) % 60;
        return `${
            hours > 0 ? (hours < 10 ? "0" : "") + hours.toString() + ":" : ""
        }${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    }

    render(): JSX.Element {
        return (
            <div
                className="rounded-md bg-yellow-500 p-3 text-green-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-3xl">Congratulations! You won!</div>
                <div>
                    You finished in:{" "}
                    <span className="font-mono">
                        {this.formatTime(Date.now() - this.props.time)}
                    </span>
                </div>
                <button
                    onClick={this.props.newGame}
                    className="p-3 m-auto bg-slate-600 rounded-lg text-white"
                >
                    New Game
                </button>
            </div>
        );
    }
}
