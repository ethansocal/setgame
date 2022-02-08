import request from "request";
import fs from "fs";

export default function scrape() {
    for (let i = 1; i <= 81; i++) {
        request(
            `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${i}.png`
        )
            .pipe(fs.createWriteStream(__dirname + `/public/cards/${i}.png`))
            .on("close", () => {
                console.log(`Downloaded image #${i}`);
            });
    }
}
if (require.main === module) {
    scrape();
}
