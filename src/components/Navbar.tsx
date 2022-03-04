import PropTypes from "prop-types";
import Timer from "./Timer";

interface Props {
    newGame: () => void;
    time: number;
    timerRunning: boolean;
}

function Navbar(props: Props): JSX.Element {
    return (
        <header className="flex m-auto shadow-lg flex-wrap">
            <h3
                id="new-game"
                onClick={props.newGame}
                className="cursor-pointer hover:text-cyan-700 dark:hover:text-sky-600 text-[20px] underline decoration-current decoration-solid m-0 h-16 p-3"
            >
                New Puzzle
            </h3>
            <h1 className="text-center text-[40px] tracking-[0.022em] grow-[1] h-16 m-0">
                Set Game!
            </h1>
            <div className={"text-[20px] w-32 text-right h-16 m-0 p-3"}>
                <Timer time={props.time} running={props.timerRunning} />
            </div>
        </header>
    );
}

Navbar.propTypes = {
    newGame: PropTypes.func.isRequired,
    time: PropTypes.number.isRequired,
    timerRunning: PropTypes.bool.isRequired,
};

export default Navbar;
