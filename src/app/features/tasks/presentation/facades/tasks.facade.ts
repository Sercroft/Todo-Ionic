import { Injectable, inject } from '@angular/core';

import type { CreateTaskDto, Task } from '../../domain/task.model';
import { ManageTasksUseCase } from '../../domain/usecase/manage-tasks-usecase';

@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private readonly manageTasks = inject(ManageTasksUseCase);

  getAll(): Promise<Task[]> {
    return this.manageTasks.getAll();
  }

  create(dto: CreateTaskDto): Promise<Task> {
    return this.manageTasks.create(dto);
  }

  update(task: Task): Promise<Task> {
    return this.manageTasks.update(task);
  }

  delete(id: string): Promise<void> {
    return this.manageTasks.delete(id);
  }

  toggleCompletion(task: Task): Promise<Task> {
    return this.manageTasks.toggleCompletion(task);
  }
}
