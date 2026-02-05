'use client';

import { trpc } from '@/shared/api/trpc/client';
import { toast } from 'sonner';

interface ToggleCompleteCheckboxProps {
  taskId: string;
  completed: boolean;
}

export function ToggleCompleteCheckbox({ taskId, completed }: ToggleCompleteCheckboxProps) {
  const utils = trpc.useUtils();

  const toggleComplete = trpc.tasks.toggleComplete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <input
      type="checkbox"
      checked={completed}
      onChange={(e) => toggleComplete.mutate({ id: taskId, completed: e.target.checked })}
      className="h-5 w-5 rounded border-gray-300 cursor-pointer"
    />
  );
}
