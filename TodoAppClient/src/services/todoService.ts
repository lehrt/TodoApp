import { Todo } from '../types/Todo';

const API_BASE_URL = '/api';

export interface CreateTodoRequest {
  name: string;
  additionalDetails?: string | null;
  dueDate?: string;
  relativeDueDateValue?: number;
  relativeDueDateUnit?: 'Seconds' | 'Minutes' | 'Hours' | 'Days';
  remindersEnabled?: boolean;
}

export interface UpdateTodoRequest {
  name: string;
  additionalDetails?: string | null;
  dueDate?: string;
  relativeDueDateValue?: number;
  relativeDueDateUnit?: 'Seconds' | 'Minutes' | 'Hours' | 'Days';
  remindersEnabled: boolean;
}

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/ToDos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/ToDos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  async createTodo(payload: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/ToDos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    return response.json();
  },

  async updateTodo(id: number, payload: UpdateTodoRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ToDos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ToDos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};
