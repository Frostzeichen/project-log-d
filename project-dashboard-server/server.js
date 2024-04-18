const express = require("express");
const d = require("./logd/log.server.js");
const mysql = require("mysql2");

require("dotenv").config();

const app = express();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true // Allows multiple statements in one query.
});
connection.connect();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
 
app.get("/", (req, res) => {
   res.render("admin/index.ejs");
});

app.get("/log-d.js", (req, res) => {
    res.sendFile(__dirname + "/logd/log.client.js");
});

app.post("/log.d/receive", (req, res) => {
    const logd = d.migrateQUery(req.body);
    const query = mysql.format(logd.query, logd.data);

    connection.query(query, (err) => {
        if (err) throw err;
    });
    res.status(200).send("OK");
});

app.listen(process.env.SV_PORT);