export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface GetTaskResponse {
  tasks_by_pk: Task | null;
}

export interface CreateTaskResponse {
  insert_tasks_one: Task;
}

export interface UpdateTaskResponse {
  update_tasks_by_pk: Task | null;
}

export interface DeleteTaskResponse {
  delete_tasks_by_pk: { id: string } | null;
}
