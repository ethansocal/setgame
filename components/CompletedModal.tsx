export default function CompletedModal(props) {
    return (
        <div
            className="rounded-md bg-yellow-400 p-3"
            onClick={(e) => e.stopPropagation()}
        >
            <div>Congratulations! You won!</div>
            <button
                onClick={() => {
                    location.reload();
                }}
            >
                New Game
            </button>
        </div>
    );
}
