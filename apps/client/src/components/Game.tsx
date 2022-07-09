import Card from "./Card";
import Completed from "./Completed";

export default function Game({
    cards,
    selected,
    setSelected,
    foundSets,
}: {
    cards: number[];
    selected: number[];
    setSelected: React.Dispatch<React.SetStateAction<number[]>>;
    foundSets: number[][];
}) {
    return (
        <div className={"flex flex-row gap-3"}>
            <div className={"grid grid-cols-4 grid-rows-3 gap-2"}>
                {cards.map((card, index) => (
                    <Card
                        key={card}
                        card={card}
                        selected={selected.includes(index)}
                        onClick={() => {
                            setSelected((current) => {
                                if (current.includes(index)) {
                                    return current.filter((x) => x !== index);
                                } else {
                                    return [index, ...current];
                                }
                            });
                        }}
                    />
                ))}
            </div>
            <div className={"grid grid-cols-3 grid-rows-6 my-auto"}>
                {Array(6)
                    .fill(0)
                    .map((_, index) =>
                        (foundSets[index] || [0, 0, 0]).map((card) => (
                            <Completed card={card} />
                        ))
                    )}
            </div>
        </div>
    );
}
