import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Timer(props) {
    const [time, setTime] = useState(0);
    function formatTime(time: number): string {
        return new Date(time * 1000).toISOString().slice(11, -5);
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now() / 1000) - props.time);
        });
        return () => clearInterval(interval);
    }, [props.time]);

    return <div className={"text-[40px]"}>{formatTime(time)}</div>;
}

Timer.propTypes = {
    time: PropTypes.number.isRequired,
};

export default Timer;
