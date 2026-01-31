import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import sql from '../lib/db';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function ClassSettings() {
  const { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [modules, setModules] = useState([]);

  // Delete Confirmation State
  // Format: { type: 'category' | 'module', id: string, name: string } | null
  const [itemToDelete, setItemToDelete] = useState(null); 

  useEffect(() => {
    async function loadData() {
      try {
        const cData = await sql`SELECT name FROM classes WHERE id = ${classId}`;
        if (cData.length) setClassName(cData[0].name);

        const catData = await sql`SELECT * FROM categories WHERE class_id = ${classId} ORDER BY name`;
        setCategories(catData);

        const modData = await sql`SELECT * FROM modules WHERE class_id = ${classId} ORDER BY sort_order ASC`;
        setModules(modData);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId]);

  // --- CATEGORY ACTIONS ---
  async function handleUpdateCategory(id, field, value) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    try {
        const val = field === 'weight' ? parseFloat(value) || 0 : value;
        if (field === 'name') await sql`UPDATE categories SET name = ${val} WHERE id = ${id}`;
        else await sql`UPDATE categories SET weight = ${val} WHERE id = ${id}`;
    } catch (err) { console.error("Failed to update category", err); }
  }

  async function handleAddCategory() {
    try {
        const result = await sql`
            INSERT INTO categories (class_id, name, weight) 
            VALUES (${classId}, 'New Category', 0) 
            RETURNING *
        `;
        if (result.length) setCategories(prev => [...prev, result[0]]);
    } catch (err) { console.error("Failed to add category", err); }
  }

  // --- MODULE ACTIONS ---
  async function handleRenameModule(id, name) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, name } : m));
    try { await sql`UPDATE modules SET name = ${name} WHERE id = ${id}`; } 
    catch (err) { console.error(err); }
  }

  async function handleMoveModule(index, direction) {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    // Update sort orders
    newModules.forEach((m, i) => m.sort_order = (i + 1) * 10);
    setModules(newModules);

    try {
        for (let i = 0; i < newModules.length; i++) {
            await sql`UPDATE modules SET sort_order = ${newModules[i].sort_order} WHERE id = ${newModules[i].id}`;
        }
    } catch (err) { console.error("Failed to reorder modules", err); }
  }

  async function handleAddModule() {
    try {
        // Calculate next sort order
        const maxOrder = modules.length > 0 ? Math.max(...modules.map(m => m.sort_order)) : 0;
        const result = await sql`
            INSERT INTO modules (class_id, name, sort_order) 
            VALUES (${classId}, 'New Module', ${maxOrder + 10}) 
            RETURNING *
        `;
        if (result.length) setModules(prev => [...prev, result[0]]);
    } catch (err) { console.error("Failed to add module", err); }
  }

  // --- DELETE EXECUTION ---
  async function executeDelete() {
    if (!itemToDelete) return;
    
    try {
        if (itemToDelete.type === 'category') {
            await sql`DELETE FROM categories WHERE id = ${itemToDelete.id}`;
            setCategories(prev => prev.filter(c => c.id !== itemToDelete.id));
        } else {
            await sql`DELETE FROM modules WHERE id = ${itemToDelete.id}`;
            setModules(prev => prev.filter(m => m.id !== itemToDelete.id));
        }
    } catch (err) {
        console.error("Failed to delete item", err);
        alert("Could not delete. Check if assignments exist using this item.");
    } finally {
        setItemToDelete(null);
    }
  }

  if (loading) return <div className="p-8"><Skeleton className="h-12 w-full mb-4"/><Skeleton className="h-64 w-full"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Link to={`/class/${classId}`}>
            <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{className} Settings</h1>
      </div>

      {/* CATEGORIES SECTION */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Grading Categories</CardTitle>
                <CardDescription>Weights must add up to 100%.</CardDescription>
            </div>
            <Button onClick={handleAddCategory} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2"/> Add Category
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            {categories.length === 0 && <p className="text-sm text-muted-foreground italic">No categories yet.</p>}
            
            {categories.map(cat => (
                <div key={cat.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                        <Input 
                            value={cat.name} 
                            onChange={(e) => handleUpdateCategory(cat.id, 'name', e.target.value)}
                            placeholder="Category Name"
                        />
                    </div>
                    <div className="col-span-3 relative">
                        <Input 
                            type="number" 
                            value={cat.weight} 
                            onChange={(e) => handleUpdateCategory(cat.id, 'weight', e.target.value)}
                            className="pr-6"
                        />
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setItemToDelete({ type: 'category', id: cat.id, name: cat.name })}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
            
            <div className="pt-4 flex justify-end">
                 <p className="text-sm text-muted-foreground">
                    Total Weight: <span className={categories.reduce((a, b) => a + (Number(b.weight) || 0), 0) === 100 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                        {categories.reduce((a, b) => a + (Number(b.weight) || 0), 0)}%
                    </span>
                 </p>
            </div>
        </CardContent>
      </Card>

      {/* MODULES SECTION */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>Drag and drop support coming soon. Use arrows to reorder.</CardDescription>
            </div>
            <Button onClick={handleAddModule} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2"/> Add Module
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            {modules.length === 0 && <p className="text-sm text-muted-foreground italic">No modules yet.</p>}

            {modules.map((mod, index) => (
                <div key={mod.id} className="flex items-center gap-4 bg-muted/30 p-3 rounded-md border">
                    <div className="flex flex-col gap-1">
                        <Button 
                            variant="ghost" size="icon" className="h-6 w-6" 
                            disabled={index === 0}
                            onClick={() => handleMoveModule(index, 'up')}
                        >
                            <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button 
                            variant="ghost" size="icon" className="h-6 w-6"
                            disabled={index === modules.length - 1}
                            onClick={() => handleMoveModule(index, 'down')}
                        >
                            <ArrowDown className="h-3 w-3" />
                        </Button>
                    </div>
                    
                    <div className="flex-1">
                        <Input 
                            value={mod.name} 
                            onChange={(e) => handleRenameModule(mod.id, e.target.value)}
                            className="bg-background"
                        />
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => setItemToDelete({ type: 'module', id: mod.id, name: mod.name })}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </CardContent>
      </Card>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemToDelete?.type === 'category' ? 'Category' : 'Module'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold text-foreground">"{itemToDelete?.name}"</span>?
              <br/><br/>
              <span className="text-red-600 font-bold">WARNING:</span> This will permanently delete all assignments and student grades associated with this {itemToDelete?.type}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}