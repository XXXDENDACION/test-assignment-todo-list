import { router } from './server';
import { tasksRouter } from './routers/tasks';

export const appRouter = router({
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
