const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// API: GET Students
app.get("/api/students", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT StudentID, FullName, BirthDate, Major FROM Students");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API: GET Teachers
app.get("/api/teachers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT TeacherID, FullName FROM Teachers");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API: GET Subjects
app.get("/api/subjects", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT SubjectID, SubjectName FROM Subjects");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API: GET Classes
app.get("/api/classes", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.ClassID, c.SubjectID, c.TeacherID, s.SubjectName, t.FullName AS TeacherName
      FROM Classes c
      JOIN Subjects s ON c.SubjectID = s.SubjectID
      JOIN Teachers t ON c.TeacherID = t.TeacherID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API: GET Scores
app.get("/api/scores", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT sc.StudentID, st.FullName, sc.ClassID, sc.SubjectID, sb.SubjectName, sc.Score
      FROM Scores sc
      JOIN Students st ON sc.StudentID = st.StudentID
      JOIN Subjects sb ON sc.SubjectID = sb.SubjectID
      JOIN Classes c ON sc.ClassID = c.ClassID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
