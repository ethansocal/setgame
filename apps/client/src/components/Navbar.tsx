import Timer from "./Timer";

function Navbar({
    newGame,
    time,
    timerRunning,
}: {
    newGame: () => void;
    time: number;
    timerRunning: boolean;
}) {
    return (
        <div className={"w-full sticky px-auto shadow-lg"}>
            <header className="navbar mx-auto max-w-7xl text-[20px] px-4">
                <div className={"navbar-start"}>
                    <button
                        onClick={newGame}
                        className="cursor-pointer hover:text-primary-hover text-primary underline decoration-current decoration-solid"
                    >
                        New Puzzle
                    </button>
                </div>
                <div className={"navbar-center"}>
                    <h1 className="text-[40px] tracking-[0.022em]">
                        Set Game!
                    </h1>
                </div>
                <div className={"navbar-end"}>
                    <Timer time={time} running={timerRunning} />
                </div>
            </header>
        </div>
    );
}

export default Navbar;
