import { Component } from "react";

interface State {
    time: number;
}

interface Props {
    time: number;
    running: boolean;
}

class Timer extends Component<Props, State> {
    interval = undefined;
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            time: 0,
        };
    }
    static formatTime(time: number): string {
        const hours = Math.floor(time / 1000 / 60 / 60);
        const minutes = Math.floor(time / 1000 / 60) % 60;
        const seconds = Math.floor(time / 1000) % 60;
        return `${
            hours > 0 ? (hours < 10 ? "0" : "") + hours.toString() + ":" : ""
        }${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    }
    componentDidMount(): void {
        this.setState({
            time: Math.floor(Date.now() / 1000) - this.props.time,
        });
        this.interval = setInterval(() => {
            if (this.props.running) {
                this.setState(() => {
                    return {
                        time: Math.floor(Date.now()) - this.props.time,
                    };
                });
            }
        }, 1);
    }
    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
        return nextProps.running;
    }

    render(): JSX.Element {
        return (
            <div className={"text-[20px] w-32 text-right"}>
                {Timer.formatTime(this.state.time)}
            </div>
        );
    }
}

export default Timer;
