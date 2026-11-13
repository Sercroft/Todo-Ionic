
import { Injectable, inject } from '@angular/core';

import { LocalStorageService } from '../../../core/storage/local-storage.service';
import type { CreateTaskDto, Task } from '../domain/task.model';
import { TaskRepository } from '../domain/task.repository';

const TASKS_STORAGE_KEY = 'todo_app_tasks_v1';

@Injectable({
  providedIn: 'root',
})
export class LocalTaskRepository extends TaskRepository {
  private readonly storage = inject(LocalStorageService);

  async getAll(): Promise<Task[]> {
    return this.storage.getItem<Task[]>(TASKS_STORAGE_KEY, []);
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const tasks = await this.getAll();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      description: dto.description?.trim(),
      completed: false,
      categoryId: dto.categoryId ?? null,
      createdAt: new Date().toISOString(),
    };

    await this.storage.setItem(TASKS_STORAGE_KEY, [...tasks, newTask]);

    return newTask;
  }

  async update(task: Task): Promise<Task> {
    const tasks = await this.getAll();

    const updatedTasks = tasks.map((currentTask) =>
      currentTask.id === task.id ? task : currentTask
    );

    await this.storage.setItem(TASKS_STORAGE_KEY, updatedTasks);

    return task;
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.getAll();

    const updatedTasks = tasks.filter((task) => task.id !== id);

    await this.storage.setItem(TASKS_STORAGE_KEY, updatedTasks);
  }

  async clearCategoryReferences(categoryId: string): Promise<void> {
    const tasks = await this.getAll();

    const updatedTasks = tasks.map((task) =>
      task.categoryId === categoryId
        ? { ...task, categoryId: null }
        : task
    );

    await this.storage.setItem(TASKS_STORAGE_KEY, updatedTasks);
  }
}
