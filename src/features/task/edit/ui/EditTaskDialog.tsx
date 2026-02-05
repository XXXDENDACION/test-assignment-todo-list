'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/shared/api/trpc/client';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { toast } from 'sonner';
import type { Task } from '@/entities/task';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const utils = trpc.useUtils();

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      onOpenChange(false);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Sync local state when task prop changes
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTask) {
      updateTask.mutate({
        id: editedTask.id,
        title: editedTask.title,
        description: editedTask.description || undefined,
        completed: editedTask.completed,
      });
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-completed"
              checked={editedTask.completed}
              onChange={(e) => setEditedTask({ ...editedTask, completed: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="edit-completed">Mark as completed</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
