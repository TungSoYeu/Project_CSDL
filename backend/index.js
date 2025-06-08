const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// GET: Student
app.get("/api/students", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Student");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: Teacher
app.get("/api/teachers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Teacher");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: Subject
app.get("/api/subjects", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Subject");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: Class
app.get("/api/classes", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT Class.ClassID, Subject.SubjectName, Teacher.FullName AS TeacherName
      FROM Class
      JOIN Subject ON Class.SubjectID = Subject.SubjectID
      JOIN Teacher ON Class.TeacherID = Teacher.TeacherID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: Score
app.get("/api/scores", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.StudentID, st.FullName, sb.SubjectName, c.ClassID, sc.Score
      FROM Score sc
      JOIN Student st ON sc.StudentID = st.StudentID
      JOIN Subject sb ON sc.SubjectID = sb.SubjectID
      JOIN Class c ON sc.ClassID = c.ClassID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API chạy tại http://localhost:${PORT}`);
});
