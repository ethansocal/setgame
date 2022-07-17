import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import PropTypes from "prop-types";

interface Props {
    cards: number[];
    found: number[][];
    win: () => void;
    socket: Socket;
    load: () => void;
}

interface Data {
    answers: number[][];
}

function AdminView(props: Props): JSX.Element {
    const [data, setData] = useState<undefined | Data>(undefined);

    useEffect(() => {
        if (localStorage.getItem("admin") !== "") {
            props.socket.on("admin", (data: Data) => {
                setData(data);
            });
        }
    });

    useEffect(() => {
        if (localStorage.getItem("admin") !== null) {
            props.socket.emit("admin", localStorage.getItem("admin"));
        }
    }, [props.cards]);
    function arraysEqual<T>(array1: T[], array2: T[]): boolean {
        return (
            array1.length === array2.length &&
            array1.every((value, index) => value === array2[index])
        );
    }

    function insideAnotherArray<T>(array: T[][], target: T[]): boolean {
        for (let i = 0; i < array.length; i++) {
            if (arraysEqual(array[i].sort(compare), target.sort(compare))) {
                return true;
            }
        }
        return false;
    }
    function compare<T>(a: T, b: T): number {
        if (a === b) return 0;

        return a < b ? -1 : 1;
    }

    return (
        <>
            {data && (
                <div className={"bg-emerald-600 rounded-lg p-3 m-3 text-white"}>
                    <div className="flex">
                        <h1 className={"text-2xl m-1"}>Admin View</h1>
                        <button
                            className="bg-yellow-500 rounded-sm p-2 m-1 text-white"
                            onClick={props.win}
                        >
                            Win
                        </button>
                        <button
                            className="bg-red-500 rounded-sm p-2 m-1 text-white"
                            onClick={() => {
                                localStorage.removeItem("admin");
                                setData(undefined);
                            }}
                        >
                            Log Out
                        </button>
                        <button
                            className="bg-green-500 rounded-sm p-2 m-1 text-white"
                            onClick={props.load}
                        >
                            Start Loading
                        </button>
                    </div>
                    <div>
                        {"Answers: (" +
                            data.answers
                                .filter((x) => {
                                    return !insideAnotherArray(
                                        props.found,
                                        x.map((x) => props.cards.indexOf(x))
                                    );
                                })
                                .map((answer) =>
                                    answer
                                        .map((x) => props.cards.indexOf(x) + 1)
                                        .sort(compare)
                                        .join(", ")
                                )
                                .join("), (") +
                            ")"}
                    </div>
                </div>
            )}
        </>
    );
}

AdminView.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.number).isRequired,
    found: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    win: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    socket: PropTypes.instanceOf(Socket).isRequired,
};

export default AdminView;
