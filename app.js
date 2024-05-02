const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// -------------------------------------
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// DBとの接続-----------------------------------------
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yamamune1!",
  database: "sakila",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

connection.query(
  "SELECT count(*)  AS totalCount FROM member",
  (error, results) => {
    console.log(results, "ok");
  }
);

connection.query("SELECT * FROM member", (error, results) => {
  console.log(results, "okay");
});

// -----getを取得した場合の処理-----------------------------
app.get("/form", (req, res) => {
  const params = req.query;
  console.log(params);
  console.log("Received data:", req.body);
  res.status(200).send({
    message: " data received successfully",
    data: req.query,
  });
});
// ----------postを取得した場合の処理-----------------------
app.post("/form", (req, res) => {
  const newData = req.body;
  connection.query(
    "INSERT INTO member (name, location, phone, title) VALUES (?, ?, ?, ?)",
    [newData.name, newData.location, newData.phone, newData.title]
  );
});

// ---------ポートについて------------------------------------
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
