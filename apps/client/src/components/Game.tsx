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
        <div className={"flex lg:flex-row gap-3 flex-col"}>
            <div className={"grid grid-cols-4 grid-rows-3 gap-2 my-auto"}>
                {cards.map((card, index) => (
                    <Card
                        key={`${card}-${index}`}
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
            <div className={"grid grid-cols-3 grid-rows-6 m-auto shrink-0"}>
                {Array(6)
                    .fill(0)
                    .map((_, index) =>
                        (foundSets[index] || [0, 0, 0]).map((card) => (
                            <Completed key={index} card={card} />
                        ))
                    )}
            </div>
        </div>
    );
}
