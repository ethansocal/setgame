import Image from "next/image";
import PropTypes from "prop-types";

function Card(props) {
    return (
        <div
            className={
                "border-2 border-gray-500 rounded-lg shadow-lg overflow-hidden cursor-pointer m-auto transition-all motion-safe:duration-200 bg-white" +
                (props.selected
                    ? " border-yellow-500 shadow-yellow-500 shadow-xl"
                    : "")
            }
            onClick={props.onClick}
        >
            <Image
                src={`/card/${props.card !== 0 ? props.card : "empty"}.png`}
                blurDataURL="true"
                width={258}
                height={167}
                className="m-auto"
                alt=""
            />
        </div>
    );
}

Card.propTypes = {
    card: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
};

export default Card;
