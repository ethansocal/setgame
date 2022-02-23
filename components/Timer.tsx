import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Timer(props) {
    const [time, setTime] = useState(0);
    function formatTime(time: number): string {
        const hours = Math.floor(time / 1000 / 60 / 60);
        const minutes = Math.floor(time / 1000 / 60);
        const seconds = Math.floor(time / 1000) % 60;
        return `${
            hours > 0 ? (hours < 10 ? "0" : "") + hours.toString() + ":" : ""
        }${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    }
    useEffect(() => {
        setTime(Math.floor(Date.now() / 1000) - props.time);
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now()) - props.time);
        }, 1);
        return () => clearInterval(interval);
    }, [props.time]);

    return (
        <div className={"text-[20px] w-32 text-right"}>{formatTime(time)}</div>
    );
}

Timer.propTypes = {
    time: PropTypes.number.isRequired,
};

export default Timer;
