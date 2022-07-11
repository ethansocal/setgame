import CardImg from "./CardImg";

function Completed({ card }: { card: number }) {
    return (
        <div className="md:border-2 border border-black bg-white">
            <CardImg
                card={card}
                width={258}
                height={167}
                className="m-auto p-0 w-[100%] md:h-12 h-8 object-cover"
            />
        </div>
    );
}

export default Completed;
