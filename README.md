# 🍎 Sarah's Gradebook

A high-performance, responsive academic management system designed for modern educators. This project delivers a "Liquid Glass" mobile interface alongside a robust, theme-aware desktop spreadsheet for efficient data entry.

---

## ✨ Features

* **Dual-View Engine**: 
    * **Desktop**: A sticky-header spreadsheet view with keyboard navigation (arrow keys) for rapid grading.
    * **Mobile**: An iOS-inspired "Liquid Glass" floating navigation and expandable card-based student details.
* **Theme-Aware UI**: Full Dark/Light mode support using Tailwind CSS, optimized for both high-daylight classrooms and late-night grading.
* **Zero-Auth Architecture**: Simplified direct database connection for maximum speed and internal use portability.
* **Real-Time Analytics**: Automatic calculation of trimester averages and class-wide performance metrics.
* **Persistent State**: Theme preferences and database configurations are persisted locally and via Neon Postgres.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Database** | [Neon Serverless Postgres](https://neon.tech/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Components** | [Shadcn UI](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

## 🚀 Getting Started

### 1. Database Setup (Neon)
This project uses **Neon Postgres**. Because we use a direct-connection model, you must ensure your database permissions are set correctly:

1.  Create your project at [Neon.tech](https://neon.tech).
2.  Run the following SQL to allow the application to interact with your tables:
    ```sql
    ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE students DISABLE ROW LEVEL SECURITY;
    -- Repeat for all tables: modules, assignments, grades, categories
    
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO public;
    ```

### 2. Local Configuration
Create a `.env` file in the root directory:
```env
VITE_DATABASE_URL=your_neon_connection_string_here
```

### 3. Installation
```bash

#Install dependencies
npm install

# Start the development server
npm run dev
```

## 📱 Interface Design

### Desktop View
The desktop dashboard utilizes a 2-column grid system for classes. Inside the gradebook, the interface transforms into a spreadsheet where users can use Arrow Keys and Enter to move between grade cells, triggering ON CONFLICT updates to the database in real-time.

### Mobile View
The mobile interface hides complex table headers in favor of a bottom-anchored "Liquid Glass" navigation bar. Student grades are grouped into expandable containers to maximize vertical screen real estate.

## 📂 Structure
* src/lib/db.js: Direct Neon SQL client configuration.

* src/components/Layout.jsx: Responsive wrapper and Theme Toggle.

* src/pages/Dashboard.jsx: Theme-aware responsive class grid.

* src/pages/ClassPage.jsx: The core grading engine and data-fetching logic.