import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Settings2, Plus, ChevronDown, ChevronRight } from 'lucide-react';

// Hooks & Components
import { useClassData } from '../hooks/useClassData';
import AssignmentModals from '../components/AssignmentModals';
import GradeCell from '../components/GradeCell';

// UI
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ClassPage() {
    const { classId } = useParams();
    const [viewMode, setViewMode] = useState("assignments");
    const [selectedTrimester, setSelectedTrimester] = useState("1");
    const [expandedStudentId, setExpandedStudentId] = useState(null);

    // Modal States
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    // Fetch Data from Hook
    const {
        loading, classInfo, students, modules, categories, gradeMap,
        visibleAssignments, moduleGrades, getStudentAverage,
        getClassAssignmentAverage, getClassModuleAverage,
        updateGrade, addAssignment, updateAssignment, deleteAssignment
    } = useClassData(classId, selectedTrimester);

    // Color Helper
    const getScoreColor = (score) => {
        if (score === '-' || score === null) return "bg-zinc-500";
        if (score >= 90) return "bg-green-600";
        if (score >= 80) return "bg-blue-600";
        if (score >= 70) return "bg-yellow-600";
        return "bg-red-600";
    };

    const formatDateForDisplay = (d) => {
        if (!d) return "";
        const date = new Date(d);
        return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    };

    // Keyboard Navigation
    const handleKeyDown = (e, sIndex, aIndex) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        e.preventDefault();
        let nextS = sIndex, nextA = aIndex;
        if (e.key === 'ArrowUp') nextS = sIndex - 1;
        if (e.key === 'ArrowDown') nextS = sIndex + 1;
        if (e.key === 'ArrowLeft') nextA = aIndex - 1;
        if (e.key === 'ArrowRight') nextA = aIndex + 1;
        
        const nextCell = document.getElementById(`cell-${nextS}-${nextA}`);
        if (nextCell) nextCell.focus();
    };

    if (loading) return <div className="p-8"><Skeleton className="h-12 w-full mb-4"/><Skeleton className="h-64 w-full"/></div>;

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4">
            
            {/* HEADER */}
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center space-x-3">
                    <Link to="/"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        {classInfo.name}
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: classInfo.color }} />
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                    {viewMode === 'assignments' && (
                        <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Trimester 1</SelectItem>
                                <SelectItem value="2">Trimester 2</SelectItem>
                                <SelectItem value="3">Trimester 3</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <Link to={`/class/${classId}/settings`}><Button variant="outline" size="icon"><Settings2 className="h-5 w-5" /></Button></Link>
                    {viewMode === 'assignments' && (
                        <Button onClick={() => setIsAddOpen(true)} className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> New
                        </Button>
                    )}
                    <Tabs value={viewMode} onValueChange={setViewMode}>
                        <TabsList><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="modules">Modules</TabsTrigger></TabsList>
                    </Tabs>
                </div>
            </div>

            {/* MOBILE LIST */}
            <div className="md:hidden space-y-3 overflow-y-auto">
                {students.map(student => {
                    const targetItems = viewMode === 'assignments' ? visibleAssignments : [];
                    const overallAvg = getStudentAverage(student.id, targetItems);
                    return (
                        <div key={student.id} className="bg-card border rounded-lg overflow-hidden shadow-sm">
                            <div className="flex justify-between p-4 cursor-pointer" onClick={() => setExpandedStudentId(expandedStudentId === student.id ? null : student.id)}>
                                <span className="font-medium">{student.last_name}, {student.first_name}</span>
                                <Badge className={getScoreColor(overallAvg)}>{overallAvg !== '-' ? `${overallAvg}%` : '-'}</Badge>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:flex flex-1 min-h-0 rounded-md border border-border bg-card overflow-hidden flex-col shadow-sm relative">
                <div className="overflow-auto flex-1 w-full h-full relative">
                    
                    <table className="w-full text-sm text-left border-collapse min-w-max">
                        <thead className="text-xs uppercase bg-white dark:bg-zinc-950 text-muted-foreground sticky top-0 z-50 shadow-sm">
                            <tr className="border-b border-border">
                                <th className="w-[200px] sticky left-0 top-0 z-[60] bg-white dark:bg-zinc-950 border-r border-border border-b shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] px-4 py-3 font-bold text-foreground">
                                    Student
                                </th>
                                {viewMode === 'assignments' ? visibleAssignments.map(a => (
                                    <th key={a.id} className="min-w-[140px] sticky top-0 z-50 text-center cursor-pointer hover:bg-muted bg-white dark:bg-zinc-950 border-b border-r border-border/50 p-2 font-normal" onClick={() => { setEditingAssignment(a); setIsEditOpen(true); }}>
                                        <div className="flex flex-col items-center justify-center h-full">
                                            {a.assigned_date && <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 rounded mb-1 whitespace-nowrap normal-case">{formatDateForDisplay(a.assigned_date)}</span>}
                                            <span className="font-medium text-xs leading-tight line-clamp-2 text-foreground normal-case">{a.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{a.module_name}</span>
                                        </div>
                                    </th>
                                )) : modules.map(m => <th key={m.id} className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b p-4 text-center font-bold text-foreground">{m.name}</th>)}
                                
                                <th className="w-[100px] sticky right-0 top-0 z-[60] bg-white dark:bg-zinc-950 border-l border-b border-border shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center px-4 py-3 font-bold text-foreground">
                                    Average
                                </th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {students.map((student, sIndex) => (
                                <tr key={student.id} className="hover:bg-muted/30 border-b border-border last:border-0">
                                    <td className="sticky left-0 z-40 bg-white dark:bg-zinc-950 border-r border-border font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] px-4 py-3 text-foreground">
                                        <div className="truncate w-[180px]">{student.last_name}, {student.first_name}</div>
                                    </td>
                                    
                                    {viewMode === 'assignments' ? visibleAssignments.map((a, aIndex) => (
                                        <td key={a.id} className="p-0 border-r border-border/50 relative h-14 w-[140px]">
                                            <GradeCell 
                                                cellId={`cell-${sIndex}-${aIndex}`}
                                                score={gradeMap[`${student.id}-${a.id}`]}
                                                maxPoints={a.max_points}
                                                studentId={student.id} assignmentId={a.id}
                                                onSave={updateGrade}
                                                onKeyDown={(e) => handleKeyDown(e, sIndex, aIndex)}
                                            />
                                        </td>
                                    )) : modules.map(m => (
                                        <td key={m.id} className="text-center p-3">
                                            <Badge className={getScoreColor(moduleGrades[`${student.id}-${m.id}`])}>{moduleGrades[`${student.id}-${m.id}`]}%</Badge>
                                        </td>
                                    ))}

                                    <td className="sticky right-0 z-40 bg-white dark:bg-zinc-950 border-l border-border text-center font-bold shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] px-4 py-3">
                                        <span className="text-primary">{getStudentAverage(student.id, viewMode === 'assignments' ? visibleAssignments : [])}%</span>
                                    </td>
                                </tr>
                            ))}

                            {/* --- CLASS AVERAGE ROW --- */}
                            <tr className="bg-gray-100 dark:bg-zinc-800 border-t-2 border-border font-bold">
                                
                                {/* Label Cell - SOLID BACKGROUND */}
                                <td className="sticky left-0 z-40 bg-gray-100 dark:bg-zinc-800 border-r border-border font-bold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] px-4 py-3 text-foreground">
                                    Class Average
                                </td>

                                {/* Data Cells */}
                                {viewMode === 'assignments' ? visibleAssignments.map(a => {
                                    const avg = getClassAssignmentAverage(a.id, a.max_points);
                                    return (
                                        <td key={a.id} className="text-center border-r border-border/50 py-3">
                                            <span className={`${getScoreColor(avg)} text-white rounded px-2 py-1 text-xs`}>
                                                {avg !== '-' ? `${avg}%` : '-'}
                                            </span>
                                        </td>
                                    );
                                }) : modules.map(m => {
                                    const avg = getClassModuleAverage(m.id);
                                    return (
                                        <td key={m.id} className="text-center border-r border-border/50 py-3">
                                            <span className={`${getScoreColor(avg)} text-white rounded px-2 py-1 text-xs`}>
                                                {avg !== '-' ? `${avg}%` : '-'}
                                            </span>
                                        </td>
                                    );
                                })}

                                {/* Bottom Right Cell - SOLID BACKGROUND */}
                                <td className="sticky right-0 z-40 bg-gray-100 dark:bg-zinc-800 border-l border-border text-center shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] px-4 py-3">
                                    -
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODALS WRAPPER */}
            <AssignmentModals 
                modules={modules} categories={categories} selectedTrimester={selectedTrimester}
                isAddOpen={isAddOpen} setIsAddOpen={setIsAddOpen} onAdd={addAssignment}
                isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} editingAssignment={editingAssignment} onUpdate={updateAssignment} onDelete={deleteAssignment}
                isDeleteAlertOpen={isDeleteAlertOpen} setIsDeleteAlertOpen={setIsDeleteAlertOpen}
            />
        </div>
    );
}