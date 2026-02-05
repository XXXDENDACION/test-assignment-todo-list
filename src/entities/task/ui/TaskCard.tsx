'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import type { Task } from '../model/types';
import type { ReactNode } from 'react';

interface TaskCardProps {
  task: Task;
  actions?: ReactNode;
  checkbox?: ReactNode;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskCard({ task, actions, checkbox }: TaskCardProps) {
  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {checkbox}
            <div>
              <CardTitle className={`text-lg ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Created {formatDate(task.created_at)}
              </p>
            </div>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="-mt-4">
          <p className={`text-muted-foreground text-base ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
