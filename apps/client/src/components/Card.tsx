import * as React from "react";

function Card({
    selected,
    onClick,
    card,
}: {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    card: number;
    selected: boolean;
}) {
    return (
        <div
            className={
                "z-10 border-2 rounded-lg overflow-hidden cursor-pointer m-auto transition-all motion-safe:duration-200 bg-white hover:scale-105 active:scale-95 hover:z-20 active:z-0" +
                (selected
                    ? " border-accent shadow-accent shadow-xl active:shadow active:border-neutral"
                    : " active:shadow-accent active:border-accent border-neutral shadow-lg")
            }
            onClick={onClick}
        >
            <img
                src={`/cards/card_${card !== 0 ? card : "empty"}.svg`}
                width={258}
                height={167}
                className="m-auto"
                // TODO: Add dynamics alts
                alt=""
            />
        </div>
    );
}

export default Card;
