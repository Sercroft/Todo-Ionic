
import { Injectable, computed, inject, signal } from '@angular/core';

import { TaskRepository } from '../../../tasks/domain/task.repository';
import type { Category, CreateCategoryDto } from '../../domain/category.model';
import { CategoryRepository } from '../../domain/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoriesViewModel {
  private readonly categoryRepository = inject(CategoryRepository);
  private readonly taskRepository = inject(TaskRepository);

  // Estado
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Estadísticas
  readonly totalCategories = computed(() => this.categories().length);

  // Cargar categorías
  async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const categories = await this.categoryRepository.getAll();
      this.categories.set(categories);
    } catch {
      this.error.set('No fue posible cargar las categorías.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Crear categoría
  async addCategory(dto: CreateCategoryDto): Promise<void> {
    try {
      const newCategory = await this.categoryRepository.create(dto);

      this.categories.update((categories) => [...categories, newCategory]);
    } catch {
      this.error.set('No fue posible crear la categoría.');
      throw new Error('Category creation failed');
    }
  }

  // Actualizar categoría
  async updateCategory(category: Category): Promise<void> {
    try {
      const updatedCategory = await this.categoryRepository.update(category);

      this.categories.update((categories) =>
        categories.map((current) =>
          current.id === updatedCategory.id ? updatedCategory : current
        )
      );
    } catch {
      this.error.set('No fue posible actualizar la categoría.');
    }
  }

  // Eliminar categoría y desvincular tareas
  async deleteCategory(id: string): Promise<void> {
    try {
      await this.taskRepository.clearCategoryReferences(id);
      await this.categoryRepository.delete(id);

      this.categories.update((categories) =>
        categories.filter((category) => category.id !== id)
      );
    } catch {
      this.error.set('No fue posible eliminar la categoría.');
      throw new Error('Category deletion failed');
    }
  }
}
