import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from 'lucide-react';

export default function AssignmentModals({
    modules, categories, selectedTrimester,
    isAddOpen, setIsAddOpen, onAdd,
    isEditOpen, setIsEditOpen, editingAssignment, onUpdate, onDelete,
    isDeleteAlertOpen, setIsDeleteAlertOpen
}) {
    const [formTrimester, setFormTrimester] = useState("1");
    const [formModule, setFormModule] = useState("");
    const [formCategory, setFormCategory] = useState("");

    // Sync state when opening
    useEffect(() => {
        if (isAddOpen) {
            setFormTrimester(selectedTrimester);
            setFormModule(modules[0]?.id || "");
            setFormCategory(categories[0]?.id || "");
        }
    }, [isAddOpen, selectedTrimester, modules, categories]);

    useEffect(() => {
        if (isEditOpen && editingAssignment) {
            setFormTrimester(String(editingAssignment.trimester));
            setFormModule(editingAssignment.module_id);
            setFormCategory(editingAssignment.category_id);
        }
    }, [isEditOpen, editingAssignment]);

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        onAdd(Object.fromEntries(new FormData(e.target)));
        setIsAddOpen(false);
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        onUpdate(editingAssignment.id, Object.fromEntries(new FormData(e.target)));
        setIsEditOpen(false);
    };

    return (
        <>
            {/* ADD ASSIGNMENT DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle>Add Assignment</DialogTitle>
                    </DialogHeader>
                    <AssignmentForm 
                        onSubmit={handleSubmitAdd} 
                        modules={modules} categories={categories} 
                        trimester={formTrimester} setTrimester={setFormTrimester}
                        mod={formModule} setMod={setFormModule}
                        cat={formCategory} setCat={setFormCategory}
                        submitLabel="Create"
                    />
                </DialogContent>
            </Dialog>

            {/* EDIT ASSIGNMENT DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle>Edit Assignment</DialogTitle>
                    </DialogHeader>
                    {editingAssignment && (
                        <AssignmentForm 
                            onSubmit={handleSubmitUpdate}
                            initialData={editingAssignment}
                            modules={modules} categories={categories}
                            trimester={formTrimester} setTrimester={setFormTrimester}
                            mod={formModule} setMod={setFormModule}
                            cat={formCategory} setCat={setFormCategory}
                            submitLabel="Save Changes"
                            onDelete={() => setIsDeleteAlertOpen(true)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* DELETE ALERT - FIXED COMPONENTS HERE */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-white dark:bg-zinc-950">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the assignment and all grades.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { onDelete(editingAssignment.id); setIsDeleteAlertOpen(false); setIsEditOpen(false); }} className="bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Reusable Inner Form Component
function AssignmentForm({ onSubmit, initialData = {}, modules, categories, trimester, setTrimester, mod, setMod, cat, setCat, submitLabel, onDelete }) {
    const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : "";

    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
            <input type="hidden" name="trimester" value={trimester} />
            <input type="hidden" name="module_id" value={mod} />
            <input type="hidden" name="category_id" value={cat} />

            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input name="name" defaultValue={initialData.name} required className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <Input name="assigned_date" type="date" defaultValue={formatDate(initialData.assigned_date)} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Max Pts</Label>
                <Input name="max_points" type="number" defaultValue={initialData.max_points || 100} required className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Trim.</Label>
                <div className="col-span-3">
                    <Select value={trimester} onValueChange={setTrimester}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
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
                    <Select value={mod} onValueChange={setMod}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <div className="col-span-3">
                    <Select value={cat} onValueChange={setCat}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-950">
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter className="flex justify-between w-full">
                {onDelete && <Button type="button" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2"/>Delete</Button>}
                <Button type="submit" className="bg-blue-600">{submitLabel}</Button>
            </DialogFooter>
        </form>
    );
}