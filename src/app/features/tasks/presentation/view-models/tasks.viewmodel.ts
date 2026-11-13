
import { Injectable, computed, inject, signal } from '@angular/core';

import type { CreateTaskDto, Task } from '../../domain/task.model';
import { TaskRepository } from '../../domain/task.repository';

export type TaskStatusFilter = 'all' | 'pending' | 'completed';

@Injectable({
  providedIn: 'root',
})
export class TasksViewModel {
  private readonly taskRepository = inject(TaskRepository);

  readonly tasks = signal<Task[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedCategoryId = signal<string | null>(null);
  readonly statusFilter = signal<TaskStatusFilter>('all');

  readonly filteredTasks = computed(() => {
    let result = this.tasks();

    const categoryId = this.selectedCategoryId();
    const status = this.statusFilter();

    if (categoryId !== null) {
      result = result.filter(
        (task) => task.categoryId === categoryId
      );
    }

    if (status === 'pending') {
      result = result.filter((task) => !task.completed);
    }

    if (status === 'completed') {
      result = result.filter((task) => task.completed);
    }

    return result;
  });

  readonly stats = computed(() => {
    const tasks = this.tasks();

    const completed = tasks.filter((task) => task.completed).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  });

  async loadTasks(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const tasks = await this.taskRepository.getAll();
      this.tasks.set(tasks);
    } catch {
      this.error.set('No fue posible cargar las tareas.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addTask(dto: CreateTaskDto): Promise<void> {
    try {
      const newTask = await this.taskRepository.create(dto);
      this.tasks.update((tasks) => [...tasks, newTask]);
      this.error.set(null);
    } catch {
      this.error.set('No fue posible crear la tarea.');
      throw new Error('Task creation failed');
    }
  }

  async updateTask(task: Task): Promise<void> {
    try {
      const updatedTask = await this.taskRepository.update(task);

      this.tasks.update((tasks) =>
        tasks.map((current) =>
          current.id === updatedTask.id ? updatedTask : current
        )
      );

      this.error.set(null);
    } catch {
      this.error.set('No fue posible actualizar la tarea.');
      throw new Error('Task update failed');
    }
  }

  // Change status of a task (toggle completed)
  async toggleTask(task: Task): Promise<void> {
    await this.updateTask({
      ...task,
      completed: !task.completed,
    });
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.delete(id);

      this.tasks.update((tasks) =>
        tasks.filter((task) => task.id !== id)
      );

      this.error.set(null);
    } catch {
      this.error.set('No fue posible eliminar la tarea.');
      throw new Error('Task deletion failed');
    }
  }

  // Filters
  setCategoryFilter(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  setStatusFilter(status: TaskStatusFilter): void {
    this.statusFilter.set(status);
  }
}
