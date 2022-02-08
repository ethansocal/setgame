let cards = {};
let puzzleName = "";
let selected = [];
let found = [];

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

function load_data(data) {
    let card = undefined;
    for (i = 0; i < 12; i++) {
        card = document.querySelector(`#card${i + 1}`).children[0];
        card.setAttribute("src", "./cards/" + data.cards[i] + ".png");
        cards[i] = data.cards[i];
    }
    puzzleName = data.id;
    console.log("Loaded puzzle " + puzzleName);
}

function load_cards(puzzleName) {
    cards = {};
    for (i = 0; i < 12; i++) {
        card = document.querySelector(`#card${i + 1}`).children[0];
        card.classList.remove("selected");
    }
    for (i = 0; i < 18; i++) {
        document
            .querySelector(`#completed${i + 1}`)
            .setAttribute("src", "./cards/empty.png");
    }

    fetchJson(`${document.location.origin}/api/puzzles/${puzzleName}`).then(
        load_data
    );
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
        if (selected.sort in cards) {
            return sendNotification("You already found this set.");
        }
        checkSet(selected).then((result) => {
            let message = "";

            if (result.valid) {
                message = "You found a set!";
                for (i = 0; i < 3; i++) {
                    document
                        .querySelector(`#completed${found.length * 3 + i + 1}`)
                        .setAttribute(
                            "src",
                            "./cards/" + selected.sort()[i] + ".png"
                        );
                }
                found.push(selected.sort());
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
                for (i = 0; i < 12; i++) {
                    document
                        .querySelector(`#card${i + 1}`)
                        .classList.remove("selected");
                    selected = [];
                }
            }, 300);
        });
    }
}

window.addEventListener(
    "load",
    () => {
        load_cards(document.location.hash.slice(1) || "random");
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
