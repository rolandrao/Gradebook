import { useState, useEffect, useMemo } from 'react';
import sql from '../lib/db';

export function useClassData(classId, selectedTrimester) {
    const [loading, setLoading] = useState(true);
    
    // Data State
    const [classInfo, setClassInfo] = useState({ name: '', color: '#3b82f6' });
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [modules, setModules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [gradeMap, setGradeMap] = useState({});

    // --- INITIAL FETCH ---
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const cData = await sql`SELECT name, color FROM classes WHERE id = ${classId}`;
                if (cData.length) setClassInfo(cData[0]);

                setStudents(await sql`SELECT * FROM students ORDER BY last_name`);
                setModules(await sql`SELECT * FROM modules WHERE class_id = ${classId} ORDER BY sort_order`);
                setCategories(await sql`SELECT * FROM categories WHERE class_id = ${classId}`);

                // Fetch Assignments
                const aData = await sql`
                    SELECT a.*, m.name as module_name, c.name as category_name
                    FROM assignments a
                    JOIN modules m ON a.module_id = m.id
                    JOIN categories c ON a.category_id = c.id
                    WHERE m.class_id = ${classId}
                    ORDER BY a.assigned_date ASC NULLS LAST, m.sort_order ASC, a.id ASC
                `;
                setAssignments(aData);

                // Fetch Grades
                const gData = await sql`
                    SELECT g.student_id, g.assignment_id, g.score 
                    FROM grades g
                    JOIN assignments a ON g.assignment_id = a.id
                    JOIN modules m ON a.module_id = m.id
                    WHERE m.class_id = ${classId}
                `;
                const map = {};
                gData.forEach(g => map[`${g.student_id}-${g.assignment_id}`] = g.score);
                setGradeMap(map);
            } catch (err) {
                console.error("Error loading class data:", err);
            } finally {
                setLoading(false);
            }
        }
        if (classId) loadData();
    }, [classId]);

    // --- COMPUTED HELPERS ---
    const visibleAssignments = useMemo(() => {
        return assignments.filter(a => String(a.trimester) === selectedTrimester);
    }, [assignments, selectedTrimester]);

    // 1. Calculate a single student's average across visible assignments
    const getStudentAverage = (studentId, specificAssignments) => {
        let earned = 0;
        let possible = 0;
        specificAssignments.forEach(a => {
            const rawScore = gradeMap[`${studentId}-${a.id}`];
            if (rawScore !== undefined && rawScore !== null && rawScore !== '') {
                earned += Number(rawScore);
                possible += Number(a.max_points);
            }
        });
        if (possible === 0) return "-";
        const average = Math.round((earned / possible) * 100);
        return isNaN(average) ? "-" : average;
    };

    // 2. Pre-calculate module averages per student
    const moduleGrades = useMemo(() => {
        const map = {};
        students.forEach(s => {
            modules.forEach(m => {
                const modsAssignments = assignments.filter(a => a.module_id === m.id);
                map[`${s.id}-${m.id}`] = getStudentAverage(s.id, modsAssignments);
            });
        });
        return map;
    }, [students, modules, assignments, gradeMap]);

    // 3. NEW: Calculate Class Average for a specific Assignment
    const getClassAssignmentAverage = (assignmentId, maxPoints) => {
        let totalPercentage = 0;
        let count = 0;

        students.forEach(s => {
            const score = gradeMap[`${s.id}-${assignmentId}`];
            if (score !== undefined && score !== null && score !== '') {
                // Convert to percentage for the average calculation
                totalPercentage += (Number(score) / maxPoints) * 100;
                count++;
            }
        });

        if (count === 0) return "-";
        return Math.round(totalPercentage / count);
    };

    // 4. NEW: Calculate Class Average for a specific Module
    const getClassModuleAverage = (moduleId) => {
        let total = 0;
        let count = 0;

        students.forEach(s => {
            const avg = moduleGrades[`${s.id}-${moduleId}`];
            if (avg !== '-' && avg !== undefined) {
                total += Number(avg);
                count++;
            }
        });

        if (count === 0) return "-";
        return Math.round(total / count);
    };

    // --- CRUD ACTIONS ---
    const updateGrade = async (studentId, assignmentId, value) => {
        const score = parseFloat(value);
        setGradeMap(prev => ({ ...prev, [`${studentId}-${assignmentId}`]: isNaN(score) ? null : score }));
        if (isNaN(score) && value !== "") return;

        try {
            if (value === "") {
                await sql`DELETE FROM grades WHERE student_id=${studentId} AND assignment_id=${assignmentId}`;
            } else {
                await sql`
                    INSERT INTO grades (student_id, assignment_id, score)
                    VALUES (${studentId}, ${assignmentId}, ${score})
                    ON CONFLICT (student_id, assignment_id) DO UPDATE SET score = EXCLUDED.score, updated_at = now()
                `;
            }
        } catch (err) { console.error(err); }
    };

    const addAssignment = async (newAssignment) => {
        const dateValue = newAssignment.assigned_date === "" ? null : newAssignment.assigned_date;
        const result = await sql`
            INSERT INTO assignments (module_id, category_id, name, max_points, trimester, assigned_date, due_date)
            VALUES (${newAssignment.module_id}, ${newAssignment.category_id}, ${newAssignment.name}, ${newAssignment.max_points}, ${newAssignment.trimester}, ${dateValue}, NOW())
            RETURNING *
        `;
        if (result.length > 0) {
            const created = result[0];
            setAssignments(prev => {
                const newList = [...prev, {
                    ...created,
                    module_name: modules.find(m => m.id === created.module_id).name,
                    category_name: categories.find(c => c.id === created.category_id).name
                }];
                return newList.sort((a, b) => {
                    if (!a.assigned_date) return 1;
                    if (!b.assigned_date) return -1;
                    return new Date(a.assigned_date) - new Date(b.assigned_date);
                });
            });
        }
    };

    const updateAssignment = async (id, updates) => {
        const dateValue = updates.assigned_date === "" ? null : updates.assigned_date;
        await sql`
            UPDATE assignments SET 
                name = ${updates.name}, max_points = ${updates.max_points}, trimester = ${updates.trimester},
                module_id = ${updates.module_id}, category_id = ${updates.category_id}, assigned_date = ${dateValue}
            WHERE id = ${id}
        `;
        setAssignments(prev => {
            const updatedList = prev.map(a => 
                a.id === id ? { ...a, ...updates, assigned_date: dateValue,
                    module_name: modules.find(m => m.id === updates.module_id).name,
                    category_name: categories.find(c => c.id === updates.category_id).name
                } : a
            );
            return updatedList.sort((a, b) => {
                if (!a.assigned_date) return 1;
                if (!b.assigned_date) return -1;
                return new Date(a.assigned_date) - new Date(b.assigned_date);
            });
        });
    };

    const deleteAssignment = async (id) => {
        await sql`DELETE FROM assignments WHERE id = ${id}`;
        setAssignments(prev => prev.filter(a => a.id !== id));
    };

    return {
        loading, classInfo, students, assignments, modules, categories, gradeMap,
        visibleAssignments, moduleGrades, getStudentAverage, 
        getClassAssignmentAverage, getClassModuleAverage, // <-- Export new functions
        updateGrade, addAssignment, updateAssignment, deleteAssignment
    };
}