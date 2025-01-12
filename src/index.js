const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error(`Set environment variable PORT.`);
}

app.post("/asset", (req, res) => {
    const fileName = req.headers["file-name"];
    const localFileName = path.join(__dirname, "../uploads", fileName);
    const fileWriteStream = fs.createWriteStream(localFileName);
    req.pipe(fileWriteStream)
        .on("error", err => {
            console.error(`Error writing ${localFileName}`);
            console.error(err);
            res.sendStatus(500);
        })
        .on("finish", () => {
            console.log(`Done writing ${localFileName}`);
            res.sendStatus(200);
        });
});

app.get("/asset", (req, res) => {
    const fileName = req.query.fileName;
    const localFileName = path.join(__dirname, "../uploads", fileName);
    res.writeHead(200, {
        "Content-Type": "image/png",
    });

    const fileReadStream = fs.createReadStream(localFileName);
    fileReadStream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});