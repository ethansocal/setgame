import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Timer(props) {
    const [time, setTime] = useState(0);
    function formatTime(time: number): string {
        return new Date(time * 1000).toISOString().slice(11, -5);
    }
    useEffect(() => {
        setTime(Math.floor(Date.now() / 1000) - props.time);
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now() / 1000) - props.time);
        }, 1000);
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
