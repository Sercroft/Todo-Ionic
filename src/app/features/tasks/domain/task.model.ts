
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  categoryId?: string | null;
}
