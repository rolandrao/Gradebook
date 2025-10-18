const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const Database = require("better-sqlite3");

// ===================================================
// DATABASE INITIALIZATION
// ===================================================
function getDatabasePath() {
  const userDataPath = app.getPath("userData");
  const userDbPath = path.join(userDataPath, "gradebook.db");
  return userDbPath;
}

function initializeDatabase(db) {
  console.log("Creating a new blank database...");

  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      weight REAL DEFAULT 1.0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      unit_id INTEGER,
      category_id INTEGER,
      name TEXT NOT NULL,
      max_score REAL DEFAULT 100,
      due_date TEXT,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      assignment_id INTEGER NOT NULL,
      category_id INTEGER,
      unit_id INTEGER,
      subject_id INTEGER,
      points REAL,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- ======================================
    -- CREATE VIEWS
    -- ======================================

    CREATE VIEW IF NOT EXISTS student_subject_weighted_averages AS
    SELECT 
        s.id AS student_id,
        s.last_name,
        s.first_name,
        g.subject_id,
        ROUND(
          SUM(CASE WHEN g.points IS NOT NULL THEN g.points * c.weight ELSE 0 END) * 1.0 /
          SUM(CASE WHEN g.points IS NOT NULL THEN a.max_score * c.weight ELSE 0 END) * 100,
          2
        ) AS weighted_average
    FROM students s
    JOIN grades g ON g.student_id = s.id
    JOIN assignments a ON g.assignment_id = a.id
    JOIN categories c ON g.category_id = c.id
    GROUP BY s.id, g.subject_id;

    CREATE VIEW IF NOT EXISTS student_unit_averages AS
    SELECT 
        s.id AS student_id,
        s.last_name,
        s.first_name,
        a.subject_id,
        a.unit_id,
        u.name AS unit_name,
        SUM(CASE WHEN g.points IS NOT NULL THEN g.points * c.weight ELSE 0 END) * 1.0 /
        SUM(CASE WHEN g.points IS NOT NULL THEN a.max_score * c.weight ELSE 0 END) AS unit_average
    FROM students s
    JOIN grades g ON g.student_id = s.id
    JOIN assignments a ON g.assignment_id = a.id
    JOIN categories c ON a.category_id = c.id
    JOIN units u ON a.unit_id = u.id
    GROUP BY s.id, a.subject_id, a.unit_id;
  `);

  console.log("✅ Database schema created successfully.");
}

const dbPath = getDatabasePath();
const isNew = !fs.existsSync(dbPath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
console.log("Database loaded at", dbPath);
if (isNew) initializeDatabase(db);

// ===================================================
// STUDENTS
// ===================================================
function addStudent(first_name, last_name) {
  try {
    const result = db
      .prepare(`INSERT INTO students (first_name, last_name) VALUES (?, ?)`)
      .run(first_name, last_name);
    const newStudentId = result.lastInsertRowid;

    // Create blank grades for all existing assignments
    const assignments = db
      .prepare(`SELECT id AS assignment_id, category_id, unit_id, subject_id FROM assignments`)
      .all();

    const insertGrade = db.prepare(`
      INSERT INTO grades (student_id, assignment_id, category_id, unit_id, subject_id, points)
      VALUES (?, ?, ?, ?, ?, NULL)
    `);

    const insertMany = db.transaction((assignments) => {
      for (const a of assignments) {
        insertGrade.run(newStudentId, a.assignment_id, a.category_id, a.unit_id, a.subject_id);
      }
    });

    insertMany(assignments);
    return { success: true, id: newStudentId };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false, error: error.message };
  }
}

function getStudents() {
  return db.prepare("SELECT * FROM students ORDER BY last_name, first_name").all();
}

function updateStudent(id, first_name, last_name) {
  const stmt = db.prepare("UPDATE students SET first_name = ?, last_name = ? WHERE id = ?");
  const info = stmt.run(first_name, last_name, id);
  return info.changes;
}

function deleteStudent(id) {
  const stmt = db.prepare("DELETE FROM students WHERE id = ?");
  const info = stmt.run(id);
  return info.changes;
}

// ===================================================
// SUBJECTS
// ===================================================
function addSubject(name) {
  const stmt = db.prepare("INSERT INTO subjects (name) VALUES (?)");
  const info = stmt.run(name);
  return info.lastInsertRowid;
}

function getSubjects() {
  return db.prepare("SELECT * FROM subjects ORDER BY name").all();
}

function getSubjectID(subjectName) {
  const subject_id = db.prepare("SELECT id FROM subjects WHERE name = ?").get(subjectName);
  return subject_id?.id;
}

function deleteSubject(id) {
  const stmt = db.prepare("DELETE FROM subjects WHERE id = ?");
  const info = stmt.run(id);
  return info.changes;
}

// ===================================================
// UNITS
// ===================================================
function addUnit(subject_id, name) {
  const stmt = db.prepare("INSERT INTO units (subject_id, name) VALUES (?, ?)");
  const info = stmt.run(subject_id, name);
  return info.lastInsertRowid;
}

function getUnitsBySubject(subject_id) {
  return db
    .prepare("SELECT * FROM units WHERE subject_id = ? ORDER BY id")
    .all(subject_id);
}

function getUnitAveragesBySubject(subject_id) {
  return db
    .prepare(`
      SELECT a.* FROM student_unit_averages a
      WHERE a.subject_id = ? ORDER BY a.student_id, a.unit_id
    `)
    .all(subject_id);
}

// ===================================================
// CATEGORIES
// ===================================================
function addCategory(subject_id, name, weight = 1.0) {
  const stmt = db.prepare("INSERT INTO categories (subject_id, name, weight) VALUES (?, ?, ?)");
  const info = stmt.run(subject_id, name, weight);
  return info.lastInsertRowid;
}

function getCategories(subject_id) {
  return db
    .prepare("SELECT * FROM categories WHERE subject_id = ? ORDER BY name")
    .all(subject_id);
}

// ===================================================
// ASSIGNMENTS
// ===================================================
function addAssignment(subject_id, unit_id, category_id, name, max_score, due_date = null) {
  const stmt = db.prepare(`
    INSERT INTO assignments (subject_id, unit_id, category_id, name, max_score, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(subject_id, unit_id, category_id, name, max_score, due_date);
  const assignment_id = info.lastInsertRowid;

  const students = getStudents();
  const insertGrade = db.prepare(`
    INSERT INTO grades (student_id, assignment_id, category_id, unit_id, subject_id, points)
    VALUES (?, ?, ?, ?, ?, NULL)
  `);

  const insertMany = db.transaction((students) => {
    for (const s of students) {
      insertGrade.run(s.id, assignment_id, category_id, unit_id, subject_id);
    }
  });

  insertMany(students);
  return assignment_id;
}

function getAssignmentsBySubject(subject_id) {
  return db
    .prepare(`
      SELECT a.*, c.name AS category_name, u.name AS unit_name
      FROM assignments a
      LEFT JOIN categories c ON c.id = a.category_id
      LEFT JOIN units u ON u.id = a.unit_id
      WHERE a.subject_id = ?
      ORDER BY a.id
    `)
    .all(subject_id);
}

function updateAssignment(assignment_id, subject_id, unit_id, category_id, title, max_score, due_date) {
  const stmt = db.prepare(`
    UPDATE assignments 
    SET subject_id = ?, unit_id = ?, category_id = ?, name = ?, max_score = ?, due_date = ?
    WHERE id = ?
  `);
  const info = stmt.run(subject_id, unit_id, category_id, title, max_score, due_date, assignment_id);

  const stmt2 = db.prepare(`
    UPDATE grades SET category_id = ?, unit_id = ?, subject_id = ? WHERE assignment_id = ?
  `);
  stmt2.run(category_id, unit_id, subject_id, assignment_id);
  return info.changes;
}

function deleteAssignment(assignment_id) {
  const stmt = db.prepare("DELETE FROM assignments WHERE id = ?");
  const info = stmt.run(assignment_id);
  return info.changes;
}

// ===================================================
// GRADES
// ===================================================
function getGradesBySubject(subject_id) {
  return db
    .prepare(`
      SELECT g.*, a.name, s.first_name, s.last_name
      FROM grades g
      LEFT JOIN assignments a ON a.id = g.assignment_id
      LEFT JOIN students s ON s.id = g.student_id
      WHERE g.subject_id = ?
      ORDER BY s.last_name, s.first_name
    `)
    .all(subject_id);
}

function getWeightedAverageBySubject(subject_id) {
  return db
    .prepare("SELECT * FROM student_subject_weighted_averages WHERE subject_id = ?")
    .all(subject_id);
}

function updateGrade(student_id, assignment_id, points) {
  const stmt = db.prepare(`
    UPDATE grades SET points = ? WHERE student_id = ? AND assignment_id = ?
  `);
  const info = stmt.run(points, student_id, assignment_id);
  return info.changes;
}

// ===================================================
// EXPORTS
// ===================================================
module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  addSubject,
  getSubjects,
  getSubjectID,
  deleteSubject,
  addUnit,
  getUnitsBySubject,
  getUnitAveragesBySubject,
  addCategory,
  getCategories,
  addAssignment,
  getAssignmentsBySubject,
  updateAssignment,
  deleteAssignment,
  getGradesBySubject,
  getWeightedAverageBySubject,
  updateGrade,
};
