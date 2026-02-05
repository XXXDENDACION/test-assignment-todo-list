'use client';

import { TaskList } from '@/widgets/task-list';
import { CreateTaskDialog } from '@/features/task/create';

export default function TasksPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <CreateTaskDialog />
      </div>
      <TaskList />
    </main>
  );
}
