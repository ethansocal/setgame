import PropTypes from "prop-types";

interface Props {
    active: boolean;
}

function LoadingScreen(props: Props): JSX.Element {
    return (
        <div
            className={
                "w-screen h-screen bg-slate-700 transform-gpu transition-transform duration-500" +
                (props.active ? " translate-y-0" : " translate-y-[100%]")
            }
        >
            Please wait while we load your experience...
        </div>
    );
}

LoadingScreen.propTypes = {
    active: PropTypes.bool.isRequired,
};

export default LoadingScreen;
