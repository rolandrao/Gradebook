import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

export default function GradeCell({ 
    score, 
    maxPoints, 
    studentId, 
    assignmentId, 
    onSave, 
    cellId, 
    onKeyDown,
    isActiveRow, 
    isActiveCol, 
    onFocus,
    onBlur // NEW: Accept onBlur from parent
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [localScore, setLocalScore] = useState(score ?? '');
    
    useEffect(() => {
        setLocalScore(score ?? '');
    }, [score]);

    const percentage = (localScore !== '' && maxPoints > 0) 
        ? Math.round((parseFloat(localScore) / maxPoints) * 100) 
        : null;

    // Handle saving and losing focus from the INPUT
    const handleInputBlur = () => {
        setIsEditing(false);
        if (localScore != (score ?? '')) {
            onSave(studentId, assignmentId, localScore);
        }
        // Tell parent we are done interacting
        if (onBlur) onBlur();
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
            handleInputBlur(); 
        } else if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            handleInputBlur(); // Save first
            onKeyDown(e); // Then move
        }
    };

    // Highlight Logic
    const getBackgroundClass = () => {
        if (isActiveRow && isActiveCol) return "bg-blue-100 dark:bg-blue-900/30"; 
        if (isActiveRow || isActiveCol) return "bg-blue-50/50 dark:bg-blue-900/10"; 
        return "hover:bg-muted/50"; 
    };

    // --- RENDER ---

    if (isEditing) {
        return (
            <Input 
                id={cellId} 
                type="number" 
                autoFocus
                className="w-full h-full rounded-none border-2 border-blue-600 bg-white dark:bg-black text-center text-lg font-bold focus-visible:ring-0 m-0 p-0 shadow-lg z-50 relative"
                placeholder="-"
                value={localScore}
                onChange={(e) => setLocalScore(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
            />
        );
    }

    return (
        <div 
            id={cellId}
            tabIndex={0}
            className={`w-full h-14 flex items-center justify-center cursor-pointer transition-colors outline-none 
                       focus:ring-2 focus:ring-inset focus:ring-blue-600 
                       ${getBackgroundClass()}`}
            onClick={() => setIsEditing(true)}
            onKeyDown={handleContainerKeyDown}
            // Trigger focus state
            onFocus={() => {
                if (onFocus) onFocus();
                const el = document.getElementById(cellId);
                if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }}
            // Clear focus state on blur
            onBlur={() => {
                if (onBlur) onBlur();
            }}
            // REMOVED onMouseEnter
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