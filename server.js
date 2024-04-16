const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.json()); // Works without bodyparser.

app.get("/", (req, res) => {
    res.render("home/index.ejs");
});

app.get("/home", (req, res) => {
    res.render("home/index.ejs");
});

app.get("/log-d.js", (req, res) => {
    res.sendFile(__dirname + "/views/assets/log-d.js");
});

app.post("/log.d/receive", (req, res) => {
    res.status(200)
})

app.listen(PORT);