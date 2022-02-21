const https = require("https");
const fs = require("fs");

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
}
scrape();
