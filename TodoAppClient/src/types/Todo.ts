export interface Todo {
  id: number;
  name: string;
  additionalDetails: string;
  createdDate: string;
  dueDate: string | null;
  remindersEnabled: boolean;
}
