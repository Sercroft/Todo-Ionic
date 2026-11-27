import { Injectable, inject } from '@angular/core';

import type { CreateTaskDto, Task } from '../task.model';
import { TaskRepository } from '../task.repository';

@Injectable({ providedIn: 'root' })
export class ManageTasksUseCase {
  private readonly taskRepository = inject(TaskRepository);

  getAll(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  create(dto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(dto);
  }

  update(task: Task): Promise<Task> {
    return this.taskRepository.update(task);
  }

  delete(id: string): Promise<void> {
    return this.taskRepository.delete(id);
  }

  toggleCompletion(task: Task): Promise<Task> {
    return this.taskRepository.update({
      ...task,
      completed: !task.completed,
    });
  }
}
