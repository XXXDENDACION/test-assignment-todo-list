'use client';

import { trpc } from '@/shared/api/trpc/client';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { toast } from 'sonner';

interface DeleteTaskDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({ taskId, open, onOpenChange }: DeleteTaskDialogProps) {
  const utils = trpc.useUtils();

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      onOpenChange(false);
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    if (taskId) {
      deleteTask.mutate({ id: taskId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
