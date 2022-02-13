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

function checkInside(target, list) {
    for (let i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) == JSON.stringify(target)) {
            return true;
        }
    }
    return false;
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
                .querySelector(`#completed${i * 3 + j}`)
                .setAttribute("src", "./card/" + found[i][j] + ".png");
        }
    }
}

function clickCard(cardId) {
    let card = document.querySelector(`#card${cardId}`);
    if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        selected.splice(selected.indexOf(cardId));
    } else {
        card.classList.add("selected");
        selected.push(cardId);
    }
    if (selected.length === 3) {
        if (checkInside(selected.sort(), found)) {
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    document
                        .querySelector(`#card${i}`)
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
                        .querySelector(`#card${i}`)
                        .classList.remove("selected");
                    selected = [];
                }
            }, 500);
        });
    }
}

document.querySelectorAll(".card").forEach((card, num) => {
    card.addEventListener("click", () => {
        clickCard(num);
    });
});

document.querySelector("#new-game").addEventListener("click", () => {
    fetch("/api/newgame", { method: "POST" }).then((result) => {
        location.reload();
    });
});
