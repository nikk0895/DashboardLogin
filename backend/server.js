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

// =====================
// STUDENTS
// =====================
app.get("/students", (req, res) => {
  const query = `
    SELECT 
      student_id,
      name, 
      email, 
      mobile, 
      course, 
      course_fee,
      join_date,
      amount_paid,
      amount_remaining,
      batch,
      due_date
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

// =====================
// REGISTER STUDENT (insert into students + payments + bills)
// =====================
app.post("/register", (req, res) => {
  const { name, mobile, email, join_date, course, course_fee, amount_paid, due_date, batch, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 🚫 Removed amount_remaining from INSERT
  const studentQuery = `
    INSERT INTO students 
    (name, mobile, email, join_date, course, course_fee, amount_paid, due_date, batch, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    studentQuery,
    [name, mobile, email, join_date, course, course_fee, amount_paid, due_date, batch, password],
    (err, result) => {
      if (err) {
        console.error("❌ Error registering student:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const studentId = result.insertId;

      // Calculate remaining (for payments & bills)
      const remaining = course_fee - amount_paid;

      // Insert into payments
      const paymentQuery = `
        INSERT INTO payments (student_id, course, course_fee, amount_paid, amount_remaining, payment_date)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      db.query(paymentQuery, [studentId, course, course_fee, amount_paid, remaining], (err) => {
        if (err) console.error("⚠️ Error inserting into payments:", err);
      });

      // Insert into pending bills
      const billQuery = `
        INSERT INTO pending_bills (student_id, course, amount_paid, amount_remaining, due_date)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(billQuery, [studentId, course, amount_paid, remaining, due_date], (err) => {
        if (err) console.error("⚠️ Error inserting into pending_bills:", err);
      });

      res.json({ message: "✅ Student registered successfully", studentId });
    }
  );
});

// =====================
// LOGIN STUDENT
// =====================
app.post("/login", (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ error: "Student ID and password required" });
  }

  const query = "SELECT * FROM students WHERE student_id = ? AND password = ?";
  db.query(query, [studentId, password], (err, results) => {
    if (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid Student ID or Password" });
    }
    res.json({ message: "✅ Login successful", student: results[0] });
  });
});

// =====================
// BATCHES
// =====================
app.get("/batches", (req, res) => {
  const query = `SELECT id, course, batch_name FROM batches`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching batches:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// =====================
// PAYMENTS
// =====================
app.get("/payments", (req, res) => {
  const query = `
    SELECT 
      s.name,
      p.course,
      p.course_fee,
      p.amount_paid,
      p.amount_remaining,
      p.payment_date
    FROM payments p
    JOIN students s ON p.student_id = s.student_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// =====================
// PENDING BILLS
// =====================
app.get("/bills", (req, res) => {
  const query = `
    SELECT 
      s.name,
      b.bill_no,
      b.course,
      b.amount_paid,
      b.amount_remaining,
      b.due_date
    FROM pending_bills b
    JOIN students s ON b.student_id = s.student_id
  `;
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
