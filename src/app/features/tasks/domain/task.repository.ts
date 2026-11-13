
import type { CreateTaskDto, Task } from './task.model';

export abstract class TaskRepository {
  abstract getAll(): Promise<Task[]>;

  abstract create(dto: CreateTaskDto): Promise<Task>;

  abstract update(task: Task): Promise<Task>;

  abstract delete(id: string): Promise<void>;

  abstract clearCategoryReferences(categoryId: string): Promise<void>;
}
