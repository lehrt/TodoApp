import { Todo } from '../types/Todo';

const API_BASE_URL = '/api';

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/ToDos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },
};
