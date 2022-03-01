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
            <div className="text-[20px] underline decoration-current decoration-solid flex m-0">
                <h3
                    id="new-game"
                    onClick={props.newGame}
                    className="cursor-pointer hover:text-cyan-700 dark:hover:text-sky-600"
                >
                    New Puzzle
                </h3>
            </div>
            <h1 className="text-center text-[40px] tracking-[0.022em] m-auto grow-[1]">
                Set Game!
            </h1>
            <Timer time={props.time} running={props.timerRunning} />
        </header>
    );
}

Navbar.propTypes = {
    newGame: PropTypes.func.isRequired,
    time: PropTypes.number.isRequired,
    timerRunning: PropTypes.bool.isRequired,
};

export default Navbar;
