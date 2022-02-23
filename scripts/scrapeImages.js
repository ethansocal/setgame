import fs from "fs";

import https from "https";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function scrape() {
    for (let i = 1; i <= 81; i++) {
        https.get(
            `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${i}.png`,
            (res) => {
                res.pipe(
                    fs.createWriteStream(`${__dirname}/../public/card/${i}.png`)
                );
            }
        );
    }
    https.get("https://via.placeholder.com/258x167.png/FFFFFF/FFFFFF", (res) => {
        res.pipe(fs.createWriteStream(`${__dirname}/../public/card/empty.png`));
    });
}
scrape();
