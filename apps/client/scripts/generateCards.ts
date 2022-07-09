import { parseCard } from "../src/setGame";
import fs from "fs";
import path from "path";
import _ from "lodash";

const template = `
<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">

    <defs>
        <!-- Shapes -->
        <path id="squiggle"
            d="M22.0815 1C10.303 1.00001 -0.792158 6.85996 1.24264 16.2601C3.50774 26.7242 18.9104 37.6243 16.6453 60.7325C14.6876 80.7048 0.336613 82.9687 2.60171 112.617C4.8668 142.265 32.5009 151.421 47.4506 150.985C63.7592 150.51 75.5377 144.881 75.9907 136.161C76.4437 127.441 60.1351 111.309 60.1351 97.7928C60.1351 84.2767 70.089 75.9926 70.5545 51.5764C71.4605 4.05204 33.86 0.999993 22.0815 1Z" />
        <rect width="75" height="150" rx="43.75" id="oval" />
        <polygon points="37.5,0 75,75 37.5,150 0,75" id="diamond" />

        <!-- Masks -->
        <mask id="squiggle-mask">
            <use href="#squiggle" stroke="white" fill="white" />
        </mask>
        <mask id="oval-mask">
            <use href="#oval" stroke="white" fill="white" />
        </mask>
        <mask id="diamond-mask">
            <use href="#diamond" stroke="white" fill="white" />
        </mask>

        <!-- Fills -->
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(90)">
            <line x1="0" y="0" x2="0" y2="20" stroke="COLOR" stroke-width="20" />
        </pattern>
    </defs>

    <!-- CONTENT -->

</svg>
`;

export function generateCard(cardId: number) {
    let card = parseCard(cardId);
    let color = "";
    switch (card[0]) {
        case "green":
            color = "#14a750";
            break;
        case "purple":
            color = "#613394";
            break;
        case "red":
            color = "#ea1c2d";
            break;
    }
    let pattern = "";
    switch (card[3]) {
        case "solid":
            pattern = color;
            break;
        case "striped":
            pattern = "url(#stripes)";
            break;
        case "empty":
            break;
    }
    const element = `<use href="#${card[1]}" fill="${pattern}" stroke="${color}" stroke-width="10" transform="TRANSFORM" style="transform-origin: center;"/>`;
    const spacings = {
        1: [112],
        2: [67.5, 157.5],
        3: [22, 112, 202],
    };
    const elements = Array(card[2])
        .fill(0)
        .map((_, index) => {
            return element.replace(
                "TRANSFORM",
                `translate(${spacings[card[2]][index]},25)`
            );
        });

    const result = template
        .replace("<!-- CONTENT -->", elements.join("\n\t"))
        .replace("COLOR", color);
    return result;
}

export function generateCards() {
    const files = fs.readdirSync(
        path.resolve(__dirname, "..", "public", "cards")
    );
    if (
        !_.isEqual(
            files
                .map((x) => parseInt(x.slice(5, -4), 10))
                .sort((a, b) => a - b),
            Array(72)
                .fill(0)
                .map((_, index) => index + 1)
        )
    ) {
        console.log("Regenerating cards");
        for (const file of files) {
            fs.unlinkSync(
                path.resolve(__dirname, "..", "public", "cards", file)
            );
        }
        for (let i = 1; i <= 72; i++) {
            fs.writeFileSync(
                path.resolve(
                    __dirname,
                    "..",
                    "public",
                    "cards",
                    `card_${i}.svg`
                ),
                generateCard(i)
            );
        }
    }
}

export default function cardPlugin() {
    return {
        name: "card-generator",
        buildStart: () => {
            generateCards();
        },
    };
}
