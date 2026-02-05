import { gql } from 'graphql-request';

const TASK_FIELDS = gql`
  fragment TaskFields on tasks {
    id
    title
    description
    completed
    created_at
    updated_at
  }
`;

export const GET_TASKS = gql`
  ${TASK_FIELDS}
  query GetTasks {
    tasks(order_by: { created_at: desc }) {
      ...TaskFields
    }
  }
`;

export const GET_TASK = gql`
  ${TASK_FIELDS}
  query GetTask($id: uuid!) {
    tasks_by_pk(id: $id) {
      ...TaskFields
    }
  }
`;

export const CREATE_TASK = gql`
  ${TASK_FIELDS}
  mutation CreateTask($title: String!, $description: String) {
    insert_tasks_one(object: { title: $title, description: $description }) {
      ...TaskFields
    }
  }
`;

export const UPDATE_TASK = gql`
  ${TASK_FIELDS}
  mutation UpdateTask($id: uuid!, $title: String!, $description: String, $completed: Boolean!) {
    update_tasks_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, description: $description, completed: $completed }
    ) {
      ...TaskFields
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`;

export const TOGGLE_COMPLETE = gql`
  ${TASK_FIELDS}
  mutation ToggleComplete($id: uuid!, $completed: Boolean!) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      ...TaskFields
    }
  }
`;
