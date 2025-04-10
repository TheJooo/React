require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cpf_lookup",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password);
  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log("Query results:", results);
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false });
    }
  });
});

// CREATE
app.post("/users", (req, res) => {
  const { cpf, nome, anoNascimento, endereco, genero } = req.body;
  db.query(
    "INSERT INTO users (cpf, nome, anoNascimento, endereco, genero) VALUES (?, ?, ?, ?, ?)",
    [cpf, nome, anoNascimento, endereco, genero],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao inserir usuário" });
      res.json({ success: true });
    }
  );
});

// READ ALL
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuários" });
    res.json(results);
  });
});

// READ ONE by CPF
app.get("/users/:cpf", (req, res) => {
  db.query("SELECT * FROM users WHERE cpf = ?", [req.params.cpf], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar CPF" });
    res.json(results[0]);
  });
});

// UPDATE (exceto CPF)
app.put("/users/:cpf", (req, res) => {
  const { nome, anoNascimento, endereco, genero } = req.body;
  db.query(
    "UPDATE users SET nome = ?, anoNascimento = ?, endereco = ?, genero = ? WHERE cpf = ?",
    [nome, anoNascimento, endereco, genero, req.params.cpf],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar usuário" });
      res.json({ success: true });
    }
  );
});

// DELETE
app.delete("/users/:cpf", (req, res) => {
  db.query("DELETE FROM users WHERE cpf = ?", [req.params.cpf], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar usuário" });
    res.json({ success: true });
  });
});



app.get("/users", (req, res) => {
  const { cpf } = req.query;
  let sql = "SELECT * FROM users";
  let params = [];
  if (cpf) {
    sql += " WHERE cpf = ?";
    params.push(cpf);
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
