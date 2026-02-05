import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import {
  GET_TASKS,
  GET_TASK,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TOGGLE_COMPLETE,
} from '@/shared/api/graphql/task';
import type {
  GetTasksResponse,
  GetTaskResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from '@/shared/api/graphql/task';

export const tasksRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.hasura.request<GetTasksResponse>(GET_TASKS);
    return data.tasks;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.hasura.request<GetTaskResponse>(GET_TASK, { id: input.id });
      return data.tasks_by_pk;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.hasura.request<CreateTaskResponse>(CREATE_TASK, {
        title: input.title,
        description: input.description || null,
      });
      return data.insert_tasks_one;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().optional(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.hasura.request<UpdateTaskResponse>(UPDATE_TASK, {
        id: input.id,
        title: input.title,
        description: input.description || null,
        completed: input.completed,
      });
      return data.update_tasks_by_pk;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.hasura.request<DeleteTaskResponse>(DELETE_TASK, { id: input.id });
      return data.delete_tasks_by_pk;
    }),

  toggleComplete: protectedProcedure
    .input(z.object({ id: z.uuid(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.hasura.request<UpdateTaskResponse>(TOGGLE_COMPLETE, {
        id: input.id,
        completed: input.completed,
      });
      return data.update_tasks_by_pk;
    }),
});
