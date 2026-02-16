import React, { useEffect, useState } from 'react';
import { Users, Plus, Archive, Undo2, Search, ChevronDown, ChevronRight, UserX } from 'lucide-react';
import sql from '../lib/db';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";

export default function RosterPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [gradesData, setGradesData] = useState({}); 
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  
  // View State
  const [viewMode, setViewMode] = useState("active"); // 'active' or 'archived'

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState(null);
  const [studentToRestore, setStudentToRestore] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch All Students (Active and Archived)
        const studentData = await sql`SELECT * FROM students ORDER BY last_name, first_name`;
        setStudents(studentData);

        // 2. Fetch Grade Averages
        const gradesQuery = await sql`
            SELECT 
                s.id as student_id,
                c.name as class_name,
                c.color as class_color,
                SUM(g.score) as total_earned,
                SUM(a.max_points) as total_possible
            FROM grades g
            JOIN assignments a ON a.id = g.assignment_id
            JOIN modules m ON m.id = a.module_id
            JOIN classes c ON c.id = m.class_id
            JOIN students s ON s.id = g.student_id
            GROUP BY s.id, c.id, c.name, c.color
        `;

        const map = {};
        gradesQuery.forEach(row => {
            if (!map[row.student_id]) map[row.student_id] = [];
            
            let avg = 0;
            if (row.total_possible > 0) {
                avg = Math.round((row.total_earned / row.total_possible) * 100);
            }

            map[row.student_id].push({
                name: row.class_name,
                color: row.class_color,
                average: avg
            });
        });
        setGradesData(map);

      } catch (err) {
        console.error("Error fetching roster data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ADD STUDENT
  async function handleAddStudent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const first = formData.get('first_name');
    const last = formData.get('last_name');

    try {
      const result = await sql`
        INSERT INTO students (first_name, last_name, teacher_id, archived)
        VALUES (${first}, ${last}, 1, false)
        RETURNING *
      `;
      if (result.length) {
        setStudents(prev => [...prev, result[0]].sort((a,b) => a.last_name.localeCompare(b.last_name)));
        setIsAddOpen(false);
      }
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  }

  // INLINE UPDATE
  async function handleUpdateField(id, field, value) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    try {
        if (field === 'first_name') await sql`UPDATE students SET first_name = ${value} WHERE id = ${id}`;
        else if (field === 'last_name') await sql`UPDATE students SET last_name = ${value} WHERE id = ${id}`;
    } catch (err) { console.error(`Failed to update ${field}:`, err); }
  }

  // ARCHIVE STUDENT
  async function handleArchiveStudent() {
    if (!studentToArchive) return;
    try {
      await sql`UPDATE students SET archived = TRUE WHERE id = ${studentToArchive.id}`;
      // Update local state to reflect change without refetching
      setStudents(prev => prev.map(s => s.id === studentToArchive.id ? { ...s, archived: true } : s));
      setStudentToArchive(null);
    } catch (err) {
      console.error("Failed to archive student:", err);
    }
  }

  // RESTORE STUDENT
  async function handleRestoreStudent() {
    if (!studentToRestore) return;
    try {
      await sql`UPDATE students SET archived = FALSE WHERE id = ${studentToRestore.id}`;
      // Update local state
      setStudents(prev => prev.map(s => s.id === studentToRestore.id ? { ...s, archived: false } : s));
      setStudentToRestore(null);
    } catch (err) {
      console.error("Failed to restore student:", err);
    }
  }

  const toggleRow = (id) => {
    setExpandedStudentId(expandedStudentId === id ? null : id);
  };

  // Filter based on Search AND Active/Archived Tab
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Postgres boolean might be returned as true/false or 1/0 depending on the driver, usually boolean in JS
    const isArchived = s.archived === true;
    const matchesView = viewMode === 'active' ? !isArchived : isArchived;

    return matchesSearch && matchesView;
  });

  if (loading) return <div className="p-8"><Skeleton className="h-12 w-full mb-4"/><Skeleton className="h-64 w-full"/></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Student Roster
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your master list of students and view their progress.
          </p>
        </div>
        {viewMode === 'active' && (
            <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* TABS SWITCHER */}
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="active">Active Students</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* SEARCH BAR */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search students..." 
                        className="pl-8 bg-background" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[30%]">Last Name</TableHead>
                            <TableHead className="w-[30%]">First Name</TableHead>
                            <TableHead className="w-[20%]">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No {viewMode} students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <React.Fragment key={student.id}>
                                    {/* MAIN ROW */}
                                    <TableRow 
                                        className={`cursor-pointer transition-colors ${expandedStudentId === student.id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                                        onClick={() => toggleRow(student.id)}
                                    >
                                        <TableCell>
                                            {expandedStudentId === student.id ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                                        </TableCell>
                                        <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                                            <Input 
                                                defaultValue={student.last_name}
                                                disabled={student.archived} // Disable editing if archived
                                                className="h-9 border-transparent hover:border-input focus:border-ring bg-transparent disabled:opacity-50"
                                                onBlur={(e) => handleUpdateField(student.id, 'last_name', e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                                            />
                                        </TableCell>
                                        <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                                            <Input 
                                                defaultValue={student.first_name}
                                                disabled={student.archived}
                                                className="h-9 border-transparent hover:border-input focus:border-ring bg-transparent disabled:opacity-50"
                                                onBlur={(e) => handleUpdateField(student.id, 'first_name', e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={student.archived ? "secondary" : "default"} className={student.archived ? "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"}>
                                                {student.archived ? 'Archived' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right p-2" onClick={(e) => e.stopPropagation()}>
                                            {viewMode === 'active' ? (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Archive Student"
                                                    className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                                                    onClick={() => setStudentToArchive(student)}
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Restore Student"
                                                    className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                    onClick={() => setStudentToRestore(student)}
                                                >
                                                    <Undo2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {/* EXPANDED DETAILS ROW */}
                                    {expandedStudentId === student.id && (
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableCell colSpan={5} className="p-4">
                                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                    {gradesData[student.id] && gradesData[student.id].length > 0 ? (
                                                        gradesData[student.id].map((g, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                                                                    <span className="font-medium text-sm">{g.name}</span>
                                                                </div>
                                                                <Badge variant={
                                                                    g.average >= 90 ? "default" : 
                                                                    g.average >= 80 ? "secondary" : 
                                                                    g.average >= 70 ? "outline" : "destructive"
                                                                } className={g.average >= 90 ? "bg-green-600" : ""}>
                                                                    {g.average}%
                                                                </Badge>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground italic col-span-4 p-2">
                                                            No active grades found for this student.
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>

      {/* ADD STUDENT MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-border">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Add a student to your master roster.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">First Name</Label>
              <Input id="first_name" name="first_name" required className="col-span-3 bg-background" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">Last Name</Label>
              <Input id="last_name" name="last_name" required className="col-span-3 bg-background" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM ARCHIVE ALERT */}
      <AlertDialog open={!!studentToArchive} onOpenChange={() => setStudentToArchive(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive <span className="font-bold text-foreground">{studentToArchive?.first_name} {studentToArchive?.last_name}</span>?
              <br /><br />
              They will be hidden from the active roster but their grades will be preserved. You can restore them later from the "Archived" tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveStudent} className="bg-orange-600 hover:bg-orange-700 text-white">
              Yes, Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CONFIRM RESTORE ALERT */}
      <AlertDialog open={!!studentToRestore} onOpenChange={() => setStudentToRestore(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move <span className="font-bold text-foreground">{studentToRestore?.first_name} {studentToRestore?.last_name}</span> back to the active roster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreStudent} className="bg-blue-600 hover:bg-blue-700 text-white">
              Yes, Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}