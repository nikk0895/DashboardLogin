const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // 👉 your MySQL username
  password: "root",    // 👉 your MySQL password
  database: "student_db" // 👉 must match your DB
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ✅ Routes

// Students
app.get("/students", (req, res) => {
  const query = `
    SELECT 
      name, 
      email, 
      mobile, 
      course, 
      join_date
    FROM students
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Batches
app.get("/batches", (req, res) => {
  const query = `SELECT batch_name, start_date, end_date FROM batches`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching batches:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Payments
app.get("/payments", (req, res) => {
  const query = `SELECT amount, status, payment_date FROM payments`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Bills
app.get("/bills", (req, res) => {
  const query = `SELECT bill_no, due_date, amount FROM pending_bills`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching bills:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Start Server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
