import Image from "next/image";
import PropTypes from "prop-types";

function Completed(props) {
    return (
        <div className="border-2 border-black bg-white">
            <Image
                src={`/card/${props.card !== 0 ? props.card : "empty"}.png`}
                width={258}
                height={167}
                layout="responsive"
                className="m-auto p-0 w-[100%] h-12 object-cover"
                placeholder="blur"
                blurDataURL="card/empty.png"
                alt=""
            />
        </div>
    );
}

Completed.propTypes = {
    card: PropTypes.number.isRequired,
};
export default Completed;
