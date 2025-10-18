import pandas as pd
import sqlite3

def insert_students_from_csv(db_path, csv_path):
    """
    Reads a CSV file with headers 'first_name' and 'last_name' (any order)
    and inserts the data into the students table in SQLite.

    Args:
        db_path (str): Path to the SQLite database file.
        csv_path (str): Path to the CSV file containing students.
    """
    # Read CSV into a DataFrame
    df = pd.read_csv(csv_path)

    # Ensure required columns exist
    required_cols = ['first_name', 'last_name']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"CSV is missing required columns: {missing}")

    # Drop rows with missing data
    df = df.dropna(subset=required_cols)

    # Connect to SQLite
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Insert each row
    for _, row in df.iterrows():
        # Pick columns dynamically by name
        c.execute(
            "INSERT INTO students (first_name, last_name) VALUES (?, ?)",
            (str(row['first_name']).strip(), str(row['last_name']).strip())
        )

    conn.commit()
    conn.close()
    print(f"{len(df)} students from {csv_path} inserted into {db_path}.")

if __name__ == "__main__":
    insert_students_from_csv("gradebook.db", "students.csv")
