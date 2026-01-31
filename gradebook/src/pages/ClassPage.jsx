import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Settings2, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import sql from '../lib/db';

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ClassPage() {
  const { classId } = useParams();
  
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("assignments");
  const [selectedTrimester, setSelectedTrimester] = useState("1");
  const [expandedStudentId, setExpandedStudentId] = useState(null); // For Mobile View
  
  // Data
  const [classInfo, setClassInfo] = useState({ name: '', color: '#3b82f6' });
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gradeMap, setGradeMap] = useState({});

  // Modal State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Form State
  const [formTrimester, setFormTrimester] = useState("1");
  const [formModule, setFormModule] = useState("");
  const [formCategory, setFormCategory] = useState("");

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const cData = await sql`SELECT name, color FROM classes WHERE id = ${classId}`;
        if (cData.length) setClassInfo(cData[0]);

        setStudents(await sql`SELECT * FROM students ORDER BY last_name`);
        setModules(await sql`SELECT * FROM modules WHERE class_id = ${classId} ORDER BY sort_order`);
        setCategories(await sql`SELECT * FROM categories WHERE class_id = ${classId}`);

        const aData = await sql`
          SELECT a.*, m.name as module_name, c.name as category_name
          FROM assignments a
          JOIN modules m ON a.module_id = m.id
          JOIN categories c ON a.category_id = c.id
          WHERE m.class_id = ${classId}
          ORDER BY m.sort_order, a.due_date
        `;
        setAssignments(aData);

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
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId]);

  // Sync Form State
  useEffect(() => {
    if (isAddModalOpen) {
        setFormTrimester(selectedTrimester);
        setFormModule(modules[0]?.id || "");
        setFormCategory(categories[0]?.id || "");
    }
  }, [isAddModalOpen, selectedTrimester, modules, categories]);

  useEffect(() => {
    if (isEditModalOpen && editingAssignment) {
        setFormTrimester(String(editingAssignment.trimester));
        setFormModule(editingAssignment.module_id);
        setFormCategory(editingAssignment.category_id);
    }
  }, [isEditModalOpen, editingAssignment]);

  // --- COMPUTED DATA ---
  const visibleAssignments = useMemo(() => {
    return assignments.filter(a => String(a.trimester) === selectedTrimester);
  }, [assignments, selectedTrimester]);

  const getStudentAverage = (studentId, specificAssignments) => {
    let earned = 0;
    let possible = 0;
    
    specificAssignments.forEach(a => {
        const rawScore = gradeMap[`${studentId}-${a.id}`];
        if (rawScore !== undefined && rawScore !== null) {
            earned += Number(rawScore); 
            possible += Number(a.max_points);
        }
    });

    if (possible === 0) return "-";
    const average = Math.round((earned / possible) * 100);
    return isNaN(average) ? "-" : average;
  };

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

  // Color helper for badges
  const getScoreColor = (score) => {
      if (score === '-' || score === null) return "bg-zinc-500";
      if (score >= 90) return "bg-green-600";
      if (score >= 80) return "bg-blue-600";
      if (score >= 70) return "bg-yellow-600";
      return "bg-red-600";
  };

  // --- ACTIONS ---
  
  const handleKeyDown = (e, sIndex, aIndex) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) return;
    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) e.preventDefault();

    let nextS = sIndex;
    let nextA = aIndex;

    if (e.key === 'ArrowUp') nextS = sIndex - 1;
    if (e.key === 'ArrowDown' || e.key === 'Enter') nextS = sIndex + 1;
    if (e.key === 'ArrowLeft') nextA = aIndex - 1;
    if (e.key === 'ArrowRight') nextA = aIndex + 1;

    if (nextS < 0 || nextS >= students.length) return;
    if (nextA < 0 || nextA >= visibleAssignments.length) return;

    const nextCell = document.getElementById(`cell-${nextS}-${nextA}`);
    if (nextCell) {
        nextCell.focus();
        nextCell.select();
    }
  };

  async function handleGradeChange(studentId, assignmentId, value) {
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
                ON CONFLICT (student_id, assignment_id) 
                DO UPDATE SET score = EXCLUDED.score, updated_at = now()
            `;
        }
    } catch (err) { console.error(err); }
  }

  async function handleUpdateAssignment(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = Object.fromEntries(formData);
    try {
        await sql`
            UPDATE assignments SET 
                name = ${updates.name},
                max_points = ${updates.max_points},
                trimester = ${updates.trimester},
                module_id = ${updates.module_id},
                category_id = ${updates.category_id}
            WHERE id = ${editingAssignment.id}
        `;
        setAssignments(prev => prev.map(a => 
            a.id === editingAssignment.id 
            ? { ...a, ...updates, 
                module_name: modules.find(m => m.id === updates.module_id).name,
                category_name: categories.find(c => c.id === updates.category_id).name
              } 
            : a
        ));
        setIsEditModalOpen(false);
    } catch (err) { console.error(err); }
  }

  async function handleAddAssignment(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAssignment = Object.fromEntries(formData);

    try {
        const result = await sql`
            INSERT INTO assignments (module_id, category_id, name, max_points, trimester, due_date)
            VALUES (
                ${newAssignment.module_id}, 
                ${newAssignment.category_id}, 
                ${newAssignment.name}, 
                ${newAssignment.max_points}, 
                ${newAssignment.trimester},
                NOW()
            )
            RETURNING id, name, max_points, trimester, module_id, category_id
        `;

        if (result.length > 0) {
            const created = result[0];
            setAssignments(prev => [...prev, {
                ...created,
                module_name: modules.find(m => m.id === created.module_id).name,
                category_name: categories.find(c => c.id === created.category_id).name
            }]);
        }
        setIsAddModalOpen(false);
    } catch (err) {
        console.error("Failed to add assignment", err);
        alert("Failed to create assignment. Make sure Modules and Categories exist.");
    }
  }

  async function handleDeleteAssignment() {
    if (!editingAssignment) return;
    try {
        await sql`DELETE FROM assignments WHERE id = ${editingAssignment.id}`;
        setAssignments(prev => prev.filter(a => a.id !== editingAssignment.id));
        setIsDeleteAlertOpen(false);
        setIsEditModalOpen(false);
        setEditingAssignment(null);
    } catch (err) {
        console.error("Failed to delete assignment", err);
        alert("Error deleting assignment. Please try again.");
    }
  }

  if (loading) return <div className="p-8"><Skeleton className="h-12 w-full mb-4"/><Skeleton className="h-64 w-full"/></div>;

  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* 1. TOP BAR CONTROLS (Responsive) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        
        {/* Class Name */}
        <div className="flex items-center space-x-3">
            <Link to="/">
                <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {classInfo.name}
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: classInfo.color }} />
                </h1>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            
            {/* Trimester Selector & Settings (Grouped for mobile) */}
            <div className="flex gap-2">
                 {viewMode === 'assignments' && (
                    <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                        <SelectTrigger className="flex-1 md:w-[140px] bg-background border-input">
                            <SelectValue placeholder="Trimester" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            <SelectItem value="1">Trimester 1</SelectItem>
                            <SelectItem value="2">Trimester 2</SelectItem>
                            <SelectItem value="3">Trimester 3</SelectItem>
                        </SelectContent>
                    </Select>
                 )}
                 
                 {/* SETTINGS BUTTON */}
                <Link to={`/class/${classId}/settings`}>
                    <Button variant="outline" size="icon" title="Class Settings">
                        <Settings2 className="h-5 w-5" />
                    </Button>
                </Link>

                {/* ADD BUTTON (Desktop only, read-only on mobile) */}
                {viewMode === 'assignments' && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> New Assignment
                    </Button>
                )}
            </div>

            {/* View Switcher */}
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
                <TabsList className="bg-muted p-1 w-full md:w-auto grid grid-cols-2 md:flex">
                    <TabsTrigger 
                        value="assignments"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                    >
                        Assignments
                    </TabsTrigger>
                    <TabsTrigger 
                        value="modules"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                    >
                        Modules
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </div>

      {/* 2a. MOBILE VIEW: STUDENT LIST (Read Only) */}
      <div className="md:hidden space-y-3">
         {students.map(student => {
             // Calculate Total Average for the row badge
             const targetItems = viewMode === 'assignments' ? visibleAssignments : assignments;
             const overallAvg = getStudentAverage(student.id, targetItems);

             return (
                 <div key={student.id} className="bg-card border rounded-lg overflow-hidden shadow-sm">
                     {/* Summary Row */}
                     <div 
                        className="flex items-center justify-between p-4 active:bg-muted/50 cursor-pointer"
                        onClick={() => setExpandedStudentId(expandedStudentId === student.id ? null : student.id)}
                     >
                         <div className="flex items-center gap-2">
                             {expandedStudentId === student.id ? <ChevronDown className="w-4 h-4 text-muted-foreground"/> : <ChevronRight className="w-4 h-4 text-muted-foreground"/>}
                             <span className="font-medium">{student.last_name}, {student.first_name}</span>
                         </div>
                         <Badge className={`${getScoreColor(overallAvg)} text-white border-0`}>
                             {overallAvg !== '-' ? `${overallAvg}%` : '-'}
                         </Badge>
                     </div>

                     {/* Expanded Details */}
                     {expandedStudentId === student.id && (
                         <div className="bg-muted/30 border-t p-3 space-y-2">
                             {viewMode === 'assignments' ? (
                                 visibleAssignments.length === 0 ? <p className="text-sm text-muted-foreground italic text-center">No assignments in this trimester.</p> :
                                 visibleAssignments.map(a => {
                                     const score = gradeMap[`${student.id}-${a.id}`];
                                     return (
                                         <div key={a.id} className="flex justify-between items-center text-sm p-2 bg-background rounded border">
                                             <div className="flex flex-col">
                                                 <span className="font-medium">{a.name}</span>
                                                 <span className="text-xs text-muted-foreground">{a.module_name}</span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                <span className={score === undefined || score === null ? "text-muted-foreground" : "font-bold"}>
                                                    {score ?? '-'}
                                                </span>
                                                <span className="text-muted-foreground text-xs">/{a.max_points}</span>
                                             </div>
                                         </div>
                                     )
                                 })
                             ) : (
                                 modules.map(m => {
                                     const modAvg = moduleGrades[`${student.id}-${m.id}`];
                                     return (
                                        <div key={m.id} className="flex justify-between items-center text-sm p-2 bg-background rounded border">
                                            <span className="font-medium">{m.name}</span>
                                            <Badge className={`${getScoreColor(modAvg)} text-white border-0`}>
                                                {modAvg !== '-' ? `${modAvg}%` : '-'}
                                            </Badge>
                                        </div>
                                     )
                                 })
                             )}
                         </div>
                     )}
                 </div>
             )
         })}
      </div>

      {/* 2b. DESKTOP VIEW: SPREADSHEET (Editable) */}
      <div className="hidden md:flex rounded-md border border-border bg-card overflow-hidden flex-1 flex-col shadow-sm relative">
        <div className="overflow-auto flex-1 w-full h-full relative">
          <Table className="relative border-collapse">
            <TableHeader className="sticky top-0 z-40 bg-white dark:bg-zinc-950 shadow-sm">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[200px] font-bold sticky left-0 z-50 bg-white dark:bg-zinc-950 text-foreground border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Student
                </TableHead>
                {viewMode === 'assignments' ? (
                    visibleAssignments.map(a => (
                        <TableHead key={a.id} className="min-w-[140px] text-center border-r border-border/50 h-auto py-2 group cursor-pointer hover:bg-muted transition-colors bg-white dark:bg-zinc-950"
                            onClick={() => { setEditingAssignment(a); setIsEditModalOpen(true); }}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">{a.module_name}</span>
                                <span className="font-medium text-foreground text-xs leading-tight px-1 flex items-center justify-center gap-1">
                                    {a.name} <Settings2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </span>
                                <span className="text-[10px] text-muted-foreground">/{a.max_points} pts</span>
                            </div>
                        </TableHead>
                    ))
                ) : (
                    modules.map(m => (
                        <TableHead key={m.id} className="min-w-[140px] text-center border-r border-border/50 font-bold text-foreground bg-white dark:bg-zinc-950">
                            {m.name}
                        </TableHead>
                    ))
                )}
                <TableHead className="w-[100px] font-bold sticky right-0 z-50 bg-white dark:bg-zinc-950 text-foreground border-l border-border shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">
                    Average
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, sIndex) => (
                <TableRow key={student.id} className="hover:bg-muted/30 border-b border-border">
                  <TableCell className="font-medium sticky left-0 z-30 bg-white dark:bg-zinc-950 border-r border-border text-foreground shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="truncate w-[180px]">{student.last_name}, {student.first_name}</div>
                  </TableCell>
                  {viewMode === 'assignments' ? (
                      visibleAssignments.map((a, aIndex) => (
                        <TableCell key={a.id} className="p-0 border-r border-border/50 relative">
                            <Input 
                                id={`cell-${sIndex}-${aIndex}`}
                                type="number" 
                                className="w-full h-14 rounded-none border-0 bg-transparent text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset focus-visible:bg-accent/20 transition-colors"
                                placeholder="-"
                                defaultValue={gradeMap[`${student.id}-${a.id}`] ?? ''}
                                onBlur={(e) => handleGradeChange(student.id, a.id, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, sIndex, aIndex)}
                            />
                        </TableCell>
                      ))
                  ) : (
                      modules.map(m => {
                          const avg = moduleGrades[`${student.id}-${m.id}`];
                          return (
                            <TableCell key={m.id} className="text-center font-medium border-r border-border/50">
                                <span className={`${getScoreColor(avg)} text-white rounded px-2 py-0.5 text-sm`}>
                                    {avg !== '-' ? `${avg}%` : '-'}
                                </span>
                            </TableCell>
                          )
                      })
                  )}
                  <TableCell className="font-bold sticky right-0 z-30 bg-white dark:bg-zinc-950 border-l border-border text-center shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {(() => {
                        const targetAssignments = viewMode === 'assignments' ? visibleAssignments : assignments;
                        const avg = getStudentAverage(student.id, targetAssignments);
                        return <span className="text-primary">{avg !== '-' ? `${avg}%` : '-'}</span>
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 3. EDIT ASSIGNMENT MODAL (Same as before) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 text-foreground border border-border shadow-lg z-50">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Modify details for this assignment.</DialogDescription>
          </DialogHeader>
          
          {editingAssignment && (
              <form onSubmit={handleUpdateAssignment} className="grid gap-4 py-4">
                <input type="hidden" name="trimester" value={formTrimester} />
                <input type="hidden" name="module_id" value={formModule} />
                <input type="hidden" name="category_id" value={formCategory} />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingAssignment.name} className="col-span-3 bg-background" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-points" className="text-right">Max Pts</Label>
                  <Input id="edit-points" name="max_points" type="number" defaultValue={editingAssignment.max_points} className="col-span-3 bg-background" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Trim.</Label>
                  <div className="col-span-3">
                    <Select value={formTrimester} onValueChange={setFormTrimester}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            <SelectItem value="1">Trimester 1</SelectItem>
                            <SelectItem value="2">Trimester 2</SelectItem>
                            <SelectItem value="3">Trimester 3</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Module</Label>
                  <div className="col-span-3">
                     <Select value={formModule} onValueChange={setFormModule}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Category</Label>
                  <div className="col-span-3">
                     <Select value={formCategory} onValueChange={setFormCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => setIsDeleteAlertOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. CONFIRM DELETE ALERT */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border-border">
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the assignment
                <span className="font-bold text-foreground"> "{editingAssignment?.name}" </span>
                and remove all student grades associated with it.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssignment} className="bg-red-600 hover:bg-red-700">
                Yes, Delete it
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 5. ADD ASSIGNMENT MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 text-foreground border border-border shadow-lg z-50">
          <DialogHeader>
            <DialogTitle>Add New Assignment</DialogTitle>
            <DialogDescription>Create a new assignment for this class.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAssignment} className="grid gap-4 py-4">
            <input type="hidden" name="trimester" value={formTrimester} />
            <input type="hidden" name="module_id" value={formModule} />
            <input type="hidden" name="category_id" value={formCategory} />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">Name</Label>
              <Input id="add-name" name="name" placeholder="e.g. Unit 4 Quiz" required className="col-span-3 bg-background" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-points" className="text-right">Max Pts</Label>
              <Input id="add-points" name="max_points" type="number" defaultValue="100" required className="col-span-3 bg-background" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Trim.</Label>
              <div className="col-span-3">
                <Select value={formTrimester} onValueChange={setFormTrimester}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950">
                        <SelectItem value="1">Trimester 1</SelectItem>
                        <SelectItem value="2">Trimester 2</SelectItem>
                        <SelectItem value="3">Trimester 3</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Module</Label>
              <div className="col-span-3">
                <Select value={formModule} onValueChange={setFormModule}>
                    <SelectTrigger><SelectValue placeholder="Select Module" /></SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950">
                        {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Category</Label>
              <div className="col-span-3">
                <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950">
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Create Assignment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}