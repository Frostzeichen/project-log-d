const express = require("express");
const d = require("./log.d");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json()); // Works without bodyparser.

app.get("/", (req, res) => {
    res.render("home/index.ejs");
});

app.get("/home", (req, res) => {
    res.render("home/index.ejs");
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/views/assets/favicon.ico");
})

app.get("/log-d.js", (req, res) => {
    res.sendFile(__dirname + "/views/assets/log-d.js");
});

app.post("/log.d/receive", (req, res) => {
    req.body.timezone = "PHT"
    d.divert(req.body, "http://localhost:3001/log.d/receive");
    res.status(200).send("OK");
});

app.listen(PORT);