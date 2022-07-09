import PropTypes from "prop-types";

interface Props {
    card: number;
}

function Completed(props: Props): JSX.Element {
    return (
        <div className="border-2 border-black bg-white">
            <img
                src={`/card/${props.card !== 0 ? props.card : "empty"}.svg`}
                width={258}
                height={167}
                className="m-auto p-0 w-[100%] h-12 object-cover"
                alt=""
            />
        </div>
    );
}

Completed.propTypes = {
    card: PropTypes.number.isRequired,
};
export default Completed;
