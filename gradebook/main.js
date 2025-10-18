const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dbHelper = require('./db'); // Your db.js helpers

let db;

// --- Database setup ---
function getDatabasePath() {
  const userDataPath = app.getPath('userData');
  const userDbPath = path.join(userDataPath, 'gradebook.db');
  const defaultDbPath = path.join(__dirname, 'db', 'gradebook.db');

  if (!fs.existsSync(userDbPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.copyFileSync(defaultDbPath, userDbPath);
    console.log('Default DB copied to user data folder.');
  }

  return defaultDbPath;
}

// --- Create main window ---
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, 'index.html')}`
      : 'http://localhost:3000'
  );
}

// --- App ready ---
app.whenReady().then(() => {
  const dbPath = getDatabasePath();
  db = new Database(dbPath);
  console.log('Database loaded at', dbPath);

  createWindow();

  // --- IPC Handlers ---

  // Students
  ipcMain.handle('get-students', () => dbHelper.getStudents());
  ipcMain.handle('add-student', (event, first_name, last_name) => dbHelper.addStudent(first_name, last_name));
  ipcMain.handle('update-student', (event, id, first_name, last_name) => dbHelper.updateStudent(id, first_name, last_name));
  ipcMain.handle('delete-student', (event, id) => dbHelper.deleteStudent(id));

  // Subjects
  ipcMain.handle('get-subject-id', (event, subjectName) => dbHelper.getSubjectID(subjectName));
  ipcMain.handle('get-subjects', () => dbHelper.getSubjects());
  ipcMain.handle('add-subject', (event, name) => dbHelper.addSubject(name));
  ipcMain.handle('delete-subject', (event, id) => dbHelper.deleteSubject(id));

  // Units
  ipcMain.handle('get-units', (event, subjectID) => dbHelper.getUnits(subjectID));
  ipcMain.handle('add-unit', (event, subject_id, name) => dbHelper.addUnit(subject_id, name));
  ipcMain.handle('get-units-by-subject', (event, subjectID) => dbHelper.getUnitsBySubject(subjectID));
  ipcMain.handle('get-unit-averages-by-subject', (event, subjectID) => dbHelper.getUnitAveragesBySubject(subjectID));

  // Categories
  ipcMain.handle('get-categories', (event, subjectID) => dbHelper.getCategories(subjectID));
  ipcMain.handle('add-category', (event, subject_id, name, weight) => dbHelper.addCategory(subject_id, name, weight));

  // Assignments
  ipcMain.handle('get-assignments-by-subject', (event, subjectID) => dbHelper.getAssignmentsBySubject(subjectID));
  ipcMain.handle('get-assignments-by-category', (event, categoryID) => dbHelper.getAssignmentsByCategory(categoryID));
  ipcMain.handle('add-assignment', (event, subject_id, unit_id, category_id, title, max_score, due_date) => dbHelper.addAssignment(subject_id, unit_id, category_id, title, max_score, due_date));
  ipcMain.handle('update-assignment', (event, assignment_id, subject_id, unit_id, category_id, title, max_score, due_date) => dbHelper.updateAssignment(assignment_id, subject_id, unit_id, category_id, title, max_score, due_date));
  ipcMain.handle('delete-assignment', (event, assignment_id) => dbHelper.deleteAssignment(assignment_id));

  // Grades
  ipcMain.handle('get-grades', (event, assignment_id) => dbHelper.getGrades(assignment_id));
  ipcMain.handle('get-grades-by-subject', (event, subjectID) => dbHelper.getGradesBySubject(subjectID));
  ipcMain.handle('add-grade', (event, assignment_id, student_id, score) => dbHelper.addGrade(assignment_id, student_id, score));
  ipcMain.handle('update-grade', (event, student_id, assignment_id, points) => dbHelper.updateGrade(student_id, assignment_id, points));

  // Weighted Average
  ipcMain.handle('get-weighted-average-by-subject', (event, subjectID) => dbHelper.getWeightedAverageBySubject(subjectID));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
