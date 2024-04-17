const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect();

connection.query('SELECT * FROM inputs', (err, rows, fields) => {
    if (err) throw err
    console.log(fields, rows)
});

connection.end();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());

app.get("/", (req, res) => {
   res.render("admin/index.ejs");
});



app.listen(process.env.SV_PORT);