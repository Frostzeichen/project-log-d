const express = require("express");
const d = require("./log.d");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json()); // Works without bodyparser.

app.get("/", (req, res) => {
    res.render("docs/index.ejs");
});

app.get("/docs", (req, res) => {
    res.render("docs/index.ejs");
});

app.get("/docs")

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/views/assets/favicon.ico");
});

app.get("/logd.js", (req, res) => {
    try { res.redirect("http://localhost:3001/logd.js"); }
    catch { res.status(503).send("Service Unavailable") }
});

app.get("/logd/download/logd.zip", (req, res) => {
    try { res.redirect("http://localhost:3001/logd/download/logd.zip"); }
    catch { res.status(503).send("Service Unavailable") }
})

app.post("/logd/receive", (req, res) => {
    try {
        req.body.timezone = "PHT"
        d.divert(req.body, "http://localhost:3001/logd/receive");
        res.status(200).send("OK");
    }
    catch { res.status(503).send("Service Unavailable") }
});

app.listen(PORT);