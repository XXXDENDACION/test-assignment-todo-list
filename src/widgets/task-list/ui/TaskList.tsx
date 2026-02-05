'use client';

import { useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { trpc } from '@/shared/api/trpc/client';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { TaskCard, type Task } from '@/entities/task';
import { CreateTaskDialog } from '@/features/task/create';
import { EditTaskDialog } from '@/features/task/edit';
import { DeleteTaskDialog } from '@/features/task/delete';
import { ToggleCompleteCheckbox } from '@/features/task/toggle-complete';

export function TaskList() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: tasks, isLoading, error } = trpc.tasks.list.useQuery();

  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingTaskId(id);
    setIsDeleteOpen(true);
  };

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading tasks: {error.message}</p>
        <Button onClick={() => utils.tasks.list.invalidate()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No tasks yet. Create your first task!</p>
          <CreateTaskDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            checkbox={<ToggleCompleteCheckbox taskId={task.id} completed={task.completed} />}
            actions={
              <>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)}>
                  <Pencil1Icon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(task.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </>
            }
          />
        ))}
      </div>

      <EditTaskDialog task={editingTask} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <DeleteTaskDialog taskId={deletingTaskId} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </>
  );
}
