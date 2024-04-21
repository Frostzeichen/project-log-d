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

app.get("/logd/download/logd.zip", (req, res) => {
    res.sendFile(__dirname + "/logd/logd.zip");
});

app.post("/log.d/receive", (req, res) => {
    const logd = d.migrateQuery(req.body);
    const query = mysql.format(logd.query, logd.data);

    connection.query(query, (err) => {
        if (err) throw err;
    });
    res.status(200).send("OK");
});

const server = app.listen(process.env.SV_PORT);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    connection.query(
        "SELECT DATE_FORMAT(FROM_UNIXTIME(utime/1000), '%M %d %Y') AS date, COUNT(id) AS visitors FROM inputs GROUP BY DATE_FORMAT(FROM_UNIXTIME(utime/1000), '%M %d %Y'); SELECT id, route, utime, timezone FROM inputs; SELECT button, COUNT(id) AS presses FROM keyboard_inputs GROUP BY button; SELECT x_position, y_position, COUNT(id) AS frequency FROM mouse_inputs GROUP BY x_position, y_position ORDER BY frequency DESC LIMIT 100;",
        (err, row) => {
            if (err) throw err;
            socket.emit("logd", row);
        }
    );
    
});