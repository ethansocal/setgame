let cards = {};
let puzzleName = "";
let selected = [];
let found = [];
let changed = false;

async function fetchJson(url, data, method) {
    const response = await fetch(url, {
        body: JSON.stringify(data),
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    return await response.json();
}

function checkInside(target, list) {
    for (let i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) == JSON.stringify(target)) {
            return true;
        }
    }
    return false;
}

function load_data(data) {
    console.log(data);
    let card = undefined;
    for (let i = 0; i < 12; i++) {
        card = document.querySelector(`#card${i + 1}`).children[0];
        card.setAttribute("src", "./cards/" + data.cards[i] + ".png");
        cards[i] = data.cards[i];
    }
    puzzleName = data.id;
    changed = true;
    setTimeout(() => {
        changed = false;
    }, 10);
    location.hash = puzzleName;
    console.log("Loaded puzzle " + puzzleName);
}

function load_puzzle(puzzleName) {
    console.log(puzzleName);
    cards = {};
    let card = undefined;
    for (let i = 0; i < 12; i++) {
        card = document.querySelector(`#card${i + 1}`).children[0];
        card.classList.remove("selected");
    }
    for (let i = 0; i < 18; i++) {
        document
            .querySelector(`#completed${i + 1}`)
            .setAttribute("src", "./cards/empty.png");
    }

    fetchJson(`${location.origin}/api/puzzles/${puzzleName}`).then(load_data);
}

function sendNotification(message) {
    let notification = document.querySelector("#notification");
    notification.innerHTML = message;
    notification.classList.remove("hidden");
    setTimeout(() => {
        if (notification.innerHTML === message) {
            notification.classList.add("hidden");
            notification.innerHTML = "";
        }
    }, 3000);
}

function checkSet(set) {
    return fetchJson("/api/checkset", set, "POST");
}

function listToString(list) {
    if (list.length === 1 || list.length === 0) {
        return list[0];
    } else if (list.length === 2) {
        return list.join(" and ");
    } else {
        return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
    }
}

function updateFound() {
    for (let i = 0; i < found.length; i++) {
        for (let j = 0; j < 3; j++) {
            document
                .querySelector(`#completed${i * 3 + j + 1}`)
                .setAttribute("src", "./cards/" + found[i][j] + ".png");
        }
    }
}

function clickCard(cardId) {
    let card = document.querySelector(`#card${cardId}`);
    if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        selected.splice(selected.indexOf(cards[cardId - 1]));
    } else {
        card.classList.add("selected");
        selected.push(cards[cardId - 1]);
    }
    if (selected.length === 3) {
        if (checkInside(selected.sort(), found)) {
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    document
                        .querySelector(`#card${i + 1}`)
                        .classList.remove("selected");
                    selected = [];
                }
            }, 500);
            return sendNotification("You already found this set.");
        }
        checkSet(selected).then((result) => {
            let message = "";

            if (result.valid) {
                message = "You found a set!";
                found.push(selected.sort());
                updateFound();
            } else {
                let problems = [];
                if (!result.colors) {
                    problems.push("colors");
                }
                if (!result.shapes) {
                    problems.push("shapes");
                }
                if (!result.numbers) {
                    problems.push("numbers");
                }
                if (!result.shading) {
                    problems.push("shading");
                }
                message =
                    "You didn't find a set. The following properties were not valid: " +
                    listToString(problems) +
                    ".";
            }
            sendNotification(message);
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    document
                        .querySelector(`#card${i + 1}`)
                        .classList.remove("selected");
                    selected = [];
                }
            }, 500);
        });
    }
}

// Navigation
document.querySelector("#new-game").addEventListener(
    "click",
    () => {
        location.hash = "";
        location.reload();
    },
    false
);

// Event listeners

window.addEventListener(
    "load",
    () => {
        load_puzzle(location.hash.slice(1) || history.state || "random");
        for (let i = 0; i < 12; i++) {
            document
                .querySelector(`#card${i + 1}`)
                .addEventListener("click", () => {
                    clickCard(i + 1);
                });
        }
    },
    false
);

window.addEventListener(
    "hashchange",
    () => {
        if (!changed) {
            load_puzzle(location.hash.slice(1) || history.state || "random");
        }
    },
    false
);
