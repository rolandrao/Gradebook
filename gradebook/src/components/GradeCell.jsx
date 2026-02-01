import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

export default function GradeCell({ 
    score, 
    maxPoints, 
    studentId, 
    assignmentId, 
    onSave, 
    cellId, 
    onKeyDown 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [localScore, setLocalScore] = useState(score ?? '');
    
    useEffect(() => {
        setLocalScore(score ?? '');
    }, [score]);

    const percentage = (localScore !== '' && maxPoints > 0) 
        ? Math.round((parseFloat(localScore) / maxPoints) * 100) 
        : null;

    const handleBlur = () => {
        setIsEditing(false);
        if (localScore != (score ?? '')) {
            onSave(studentId, assignmentId, localScore);
        }
    };

    // --- KEYBOARD LOGIC ---
    
    const handleContainerKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            onKeyDown(e); 
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsEditing(true);
            return;
        }
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            setLocalScore('');
            onSave(studentId, assignmentId, ''); 
            return;
        }
        if (/^[0-9.]$/.test(e.key)) {
            e.preventDefault();
            setIsEditing(true);
            setLocalScore(e.key); 
            return;
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur(); 
        } else if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            handleBlur();
            onKeyDown(e); 
        }
    };

    // --- RENDER ---

    if (isEditing) {
        return (
            <Input 
                id={cellId} 
                type="number" 
                autoFocus
                // EDIT MODE STYLES: White background, strong blue border, large text
                className="w-full h-full rounded-none border-2 border-blue-600 bg-white dark:bg-black text-center text-lg font-bold focus-visible:ring-0 m-0 p-0 shadow-lg z-50 relative"
                placeholder="-"
                value={localScore}
                onChange={(e) => setLocalScore(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleInputKeyDown}
            />
        );
    }

    return (
        <div 
            id={cellId}
            tabIndex={0}
            // VIEW MODE STYLES:
            // 1. focus:ring-inset -> Keeps border inside so it doesn't get cut off
            // 2. focus:ring-2 focus:ring-blue-600 -> High contrast blue border
            // 3. focus:bg-blue-50 -> Light blue background when selected
            className="w-full h-14 flex items-center justify-center cursor-pointer transition-colors outline-none 
                       hover:bg-muted/50 
                       focus:ring-2 focus:ring-inset focus:ring-blue-600 
                       focus:bg-blue-50 dark:focus:bg-blue-900/20"
            onClick={() => setIsEditing(true)}
            onKeyDown={handleContainerKeyDown}
            onFocus={(e) => {
                e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }}
        >
            {localScore !== '' && localScore !== null ? (
                <div className="flex flex-col items-center leading-tight pointer-events-none">
                    <span className="font-semibold text-foreground text-sm">
                        {localScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {percentage}%
                    </span>
                </div>
            ) : (
                <span className="text-muted-foreground pointer-events-none">-</span>
            )}
        </div>
    );
}