import React, { useState, useEffect } from 'react';
import useStore from '../store/translationStore';
import { TranslationSchema } from '../schemas/translationSchema';
import { z } from 'zod';
import Button from './Button';
import { useUpdateTranslationMutation } from '../queries-and-mutations/translationMutations';

interface TranslationEditorProps {
    translationId: string;
    locale: string;
    currentValue: string;
}

export default function TranslationEditor({ 
    translationId, 
    locale, 
    currentValue 
}: TranslationEditorProps) {
    const { closeEditor } = useStore();
    const updateMutation = useUpdateTranslationMutation();
    
    const [editValue, setEditValue] = useState(currentValue);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        setEditValue(currentValue);
        setValidationError(null);
    }, [currentValue]);

    const validateInput = (value: string) => {
        try {
            TranslationSchema.parse({
                value,
                updatedAt: new Date().toISOString(),
                updatedBy: 'current@user.com'
            });
            setValidationError(null);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setValidationError(error.errors[0]?.message || 'Invalid input');
            }
            return false;
        }
    };

    const handleInputChange = (value: string) => {
        setEditValue(value);
        validateInput(value);
    };

    const handleSave = async () => {
        if (validateInput(editValue)) {
            try {
                await updateMutation.mutateAsync({
                    id: translationId,
                    locale,
                    data: { value: editValue }
                });
                closeEditor();
            } catch (error) {
                console.error('Failed to save translation:', error);
                // Error is already handled by the mutation's onError
            }
        }
    };

    const handleCancel = () => {
        setEditValue(currentValue);
        setValidationError(null);
        closeEditor();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const isLoading = updateMutation.isPending;
    const error = updateMutation.error?.message;

    return (
        <div className="bg-blue-50 dark:bg-stone-700 p-3 rounded border border-blue-200 dark:border-stone-600">
            <div className="mb-2">
                <textarea
                    value={editValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        validationError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={2}
                    placeholder="Enter translation..."
                    autoFocus
                    disabled={isLoading}
                />
                {validationError && (
                    <p className="text-red-500 text-xs mt-1">{validationError}</p>
                )}
                {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
            </div>
            
            <div className="flex justify-end gap-2">
                <Button
                    onClick={handleCancel}
                    variant="secondary"
                    size="sm"
                    text="Cancel"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSave}
                    disabled={!!validationError || isLoading}
                    variant="primary"
                    size="sm"
                    text={isLoading ? "Saving..." : "Save"}
                />
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Press Enter to save, Escape to cancel
            </div>
        </div>
    );
} 