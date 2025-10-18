import sqlite3

# Connect to a new database (will create the file if it doesn't exist)
conn = sqlite3.connect("gradebook.db")
c = conn.cursor()

# --- Create tables ---

# Students
c.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL
)
""")

# Subjects
c.execute("""
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
""")

# Categories
c.execute("""
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    weight REAL DEFAULT 1.0,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
)
""")

# Assignments
c.execute("""
CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    max_score REAL NOT NULL,
    due_date DATE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
)
""")

# Grades
c.execute("""
CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score REAL,
    FOREIGN KEY(assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
)
""")

conn.commit()
conn.close()

print("Temporary SQLite database 'gradebook_temp.db' created with full schema!")
