const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// -----------------------
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//DBとの接続
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yamamune1!",
  database: "sakila",
});
//一覧画面用
app.post("/all", (req, res) => {
  connection.query(
    "SELECT * FROM member LEFT OUTER JOIN assign ON member.memberid = assign.assignmemberid LEFT OUTER JOIN project ON  assign.assignprojectid= project.projectid",
    (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Error querying database" });
      } else {
        console.log("Data fetched successfully:", results);
        res.status(200).json(results);
      }
    }
  );
});

//登録画面用
app.post("/form", (req, res) => {
  const newData = req.body;
  connection.query(
    "INSERT INTO member (name, location, phone, title) VALUES (?, ?, ?, ?)",
    [newData.name, newData.location, newData.phone, newData.title],
    (error, results) => {
      if (error) {
        console.error("Error", error);
        res.status(500).json({ error: "Error querying database" });
      } else {
        console.log("Data fetched successfully:", results);
        connection.query("INSERT INTO assign (assignmemberid) VALUES (?)", [
          results.insertId,
        ]);
        console.log(results);
        res.status(200).json(results);
      }
    }
  );
});
//詳細画面用
app.post("/detail", (req, res) => {
  const newData = req.body;
  connection.query(
    "SELECT * FROM member LEFT OUTER JOIN assign ON member.memberid = assign.assignmemberid  LEFT OUTER JOIN project ON  assign.assignprojectid= project.projectid WHERE memberid = ?",
    [newData.memberid],
    (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Error querying database" });
      } else {
        console.log("Data fetched successfully:", results);
        res.status(200).json(results[0]);
      }
    }
  );
});
//検索モーダル用
app.post("/search", (req, res) => {
  const newData = req.body;
  let bindVal = [];
  let sqlSearch =
    "SELECT * FROM member LEFT OUTER JOIN assign ON member.memberid = assign.assignmemberid LEFT OUTER JOIN project ON assign.assignprojectid = project.projectid WHERE";
  if (newData.memberid) {
    sqlSearch = sqlSearch + " memberid=? AND ";
    bindVal.push(newData.memberid);
  }
  if (newData.name) {
    sqlSearch = sqlSearch + " name LIKE ?" + " AND ";
    bindVal.push(newData.name + "%");
  }
  sqlSearch = sqlSearch.slice(0, -5);

  connection.query(sqlSearch, bindVal, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Error querying database" });
    } else {
      console.log("Data fetched successfully:", results);
      res.status(200).json(results);
    }
  });
});
//編集画面
app.post("/update", (req, res) => {
  const newData = req.body;
  connection.query(
    " UPDATE member AS t1 JOIN assign AS t2 ON (t1.memberid = t2.assignmemberid) SET name=?, location=?, phone=?, title=?, assignprojectid=? WHERE memberid = ?",
    [
      newData.name,
      newData.location,
      newData.phone,
      newData.title,
      newData.assignprojectid,
      newData.memberid,
    ],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Error!! " });
      } else {
        res.status(200).json(result);
      }
    }
  );
});
//プロジェクトのプルダウン
app.post("/pullPro", (req, res) => {
  connection.query("SELECT * FROM project", (error, results) => {
    if (error) {
      res.status(500).json({ error: "error!" });
    } else {
      res.status(200).json(results);
    }
  });
});

//ポートについて
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
