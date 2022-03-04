import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

interface Props {
    active: boolean;
}

function LoadingScreen(props: Props): JSX.Element {
    const [time, setTime] = useState(0);
    let interval = undefined;
    useEffect(() => {
        if (props.active) {
            setTime(0);
            interval = setInterval(() => {
                setTime((time) => {
                    console.log(time);
                    if (time > 2) {
                        clearInterval(interval);
                    }
                    return time + 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else {
            clearInterval(interval);
        }
    }, [props.active]);

    return (
        <div
            className={
                "bg-slate-700 transition-transform duration-500 fixed top-0 bottom-0 left-0 right-0 delay-500 flex align-middle flex-col" +
                (props.active ? " translate-x-0" : " translate-x-[100%]")
            }
        >
            <h1 className="m-auto text-center text-[5vw]">
                Setting up Set Game {props.active ? <CircularProgress /> : "✅"}
            </h1>
            <h2
                className={
                    "text-center text-[3vw] transition-transform absolute bottom-0 left-0 right-0" +
                    (time > 3 ? " translate-y-0" : " translate-y-[100%]")
                }
            >
                If this takes too long, feel free to, like, leave or something.
            </h2>
        </div>
    );
}

LoadingScreen.propTypes = {
    active: PropTypes.bool.isRequired,
};

export default LoadingScreen;
