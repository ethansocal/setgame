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

function updateClicked() {
    for (let i = 0; i < 12; i++) {
        if (selected.includes(i)) {
            document.querySelector(`#card${i}`).classList.add("selected");
        } else {
            document.querySelector(`#card${i}`).classList.remove("selected");
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
                selected = [];
                updateClicked();
            }, 500);
            console.log("Set already found");
            return sendNotification("You already found this set.");
        }
        console.log("Checking set...");
        checkSet(selected).then((result) => {
            let message = "";

            if (result.valid) {
                message = "You found a set!";
                found.push(selected.sort());
                localStorage.setItem("found", JSON.stringify(found));
                updateFound();
                if (found.length === 6) {
                    document.querySelector("#data").value =
                        JSON.stringify(found);
                    document.querySelector("#data").parentElement.submit();
                }
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
            console.log(message);
            sendNotification(message);
            setTimeout(() => {
                selected = [];
                updateClicked();
            }, 500);
        });
    }
}

document.querySelectorAll(".card").forEach((card, num) => {
    card.addEventListener("click", () => {
        console.log("Card " + num + " clicked");
        clickCard(num);
    });
});

document.querySelector("#new-game").addEventListener("click", () => {
    console.log("New game started");
    fetch("/api/newgame", { method: "POST" }).then((result) => {
        location.reload();
        localStorage.setItem("found", "[]");
    });
});

window.addEventListener(
    "load",
    () => {
        console.log("Loading previous found sets...");
        if (localStorage.getItem("found") !== null) {
            let tempFound = JSON.parse(localStorage.getItem("found"));
            for (let i = 0; i < tempFound.length; i++) {
                checkSet(tempFound[i]).then((result) => {
                    if (result["valid"]) {
                        found.push(tempFound[i]);
                        updateFound();
                    }
                });
            }
        }
    },
    false
);
