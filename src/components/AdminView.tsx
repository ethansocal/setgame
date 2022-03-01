import { useEffect, useState } from "react";
import Index from "./Index";
import PropTypes from "prop-types";

interface Props {
    cards: number[];
    found: number[][];
    win: () => void;
}

interface Data {
    answers: number[][];
}

function AdminView(props: Props): JSX.Element {
    const [data, setData] = useState(undefined as undefined | Data);

    useEffect(() => {
        if (Index.getCookie("admin") !== "") {
            Index.fetchJson("/api/admin", {}, "GET").then((data) => {
                setData(data as Data);
            });
        }
    }, [props.cards]);
    function compare(a: number, b: number): number {
        if (a === b) return 0;

        return a < b ? -1 : 1;
    }

    return (
        <>
            {data && (
                <div className={"bg-red-500 rounded-sm p-3 m-3"}>
                    <h1 className={"text-2xl"}>Admin View</h1>
                    <div>
                        {"Answers: (" +
                            data.answers
                                .filter((x) => {
                                    return !Index.insideAnotherArray(
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
                    <button
                        className="bg-yellow-500 rounded-sm p-3 m-3 text-white"
                        onClick={props.win}
                    >
                        Win
                    </button>
                </div>
            )}
        </>
    );
}

AdminView.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.number).isRequired,
    found: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    win: PropTypes.func.isRequired,
};

export default AdminView;
